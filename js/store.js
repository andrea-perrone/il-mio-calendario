/*
 * Strato dati del calendario.
 *
 * L'app parla con un archivio "a documenti" con un'interfaccia minima,
 * volutamente identica a quella di Cloud Firestore:
 *
 *   db.doc(path).get()      -> { exists, data() }
 *   db.doc(path).set(obj)
 *   db.doc(path).update(obj)
 *   db.doc(path).delete()
 *   db.collection(path).onSnapshot(cb, onError) -> unsubscribe()
 *        cb riceve { docs: [{ id, data() }] }
 *
 *   user.me()         -> { id, name, isOwner }
 *   user.profiles(ids)-> { [id]: { name, color } }
 *
 * Sono disponibili due implementazioni:
 *   - LocalStore: salva tutto in localStorage (nessun server, nessun account);
 *   - Firebase:   Firestore + Google Sign-In, per condividere il calendario.
 */
(function () {
  'use strict';

  /* ---------------- modalità locale ---------------- */
  var KEY = 'cal-db-v1';
  var LOCAL_UID = 'local';

  function LocalStore() {
    var data = read();
    var listeners = [];

    function read() {
      try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
    }
    function persist() {
      try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
    }
    function clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
    function norm(p) { return String(p).replace(/^\/+|\/+$/g, ''); }

    function snapshotOf(colPath) {
      var prefix = colPath + '/', docs = [];
      Object.keys(data).forEach(function (p) {
        if (p.indexOf(prefix) !== 0) return;
        var id = p.slice(prefix.length);
        if (!id || id.indexOf('/') > -1) return;
        var v = data[p];
        docs.push({ id: id, data: function () { return clone(v); } });
      });
      return { docs: docs };
    }
    function notify() {
      setTimeout(function () {
        listeners.forEach(function (l) {
          try { l.cb(snapshotOf(l.path)); } catch (e) { console.error(e); }
        });
      }, 0);
    }
    function write(path, value) {
      if (value === undefined) delete data[path]; else data[path] = clone(value);
      persist(); notify();
      return Promise.resolve();
    }

    /* sincronizza le altre schede aperte sullo stesso browser */
    window.addEventListener('storage', function (e) {
      if (e.key === KEY) { data = read(); notify(); }
    });

    return {
      doc: function (path) {
        path = norm(path);
        return {
          get: function () {
            var v = data[path];
            return Promise.resolve({ exists: v !== undefined, data: function () { return clone(v); } });
          },
          set: function (obj) { return write(path, obj); },
          update: function (obj) {
            if (data[path] === undefined) {
              var err = new Error('Documento inesistente: ' + path); err.code = 'not-found';
              return Promise.reject(err);
            }
            return write(path, Object.assign({}, data[path], obj));
          },
          delete: function () { return write(path, undefined); }
        };
      },
      collection: function (path) {
        path = norm(path);
        return {
          onSnapshot: function (cb) {
            var l = { path: path, cb: cb };
            listeners.push(l);
            setTimeout(function () { cb(snapshotOf(path)); }, 0);
            return function () { listeners = listeners.filter(function (x) { return x !== l; }); };
          }
        };
      }
    };
  }

  var localUser = {
    me: function () { return Promise.resolve({ id: LOCAL_UID, name: '', isOwner: true }); },
    profiles: function () { return Promise.resolve({}); }
  };

  /* ---------------- modalità Firebase ---------------- */
  var FB_VERSION = '10.14.1';

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = function () { reject(new Error('Impossibile caricare ' + src)); };
      document.head.appendChild(s);
    });
  }

  function signInScreen(onClick) {
    var wrap = document.createElement('div');
    wrap.className = 'scrim';
    wrap.style.alignItems = 'center';
    wrap.innerHTML =
      '<div class="sheet" style="border-radius:var(--r);border-bottom:var(--bw) solid var(--line);max-width:420px;margin:16px">' +
      '<div class="sh-b" style="text-align:center;gap:14px">' +
      '<h2 style="margin:0;font:700 22px/1.2 var(--f-display)">Il mio calendario</h2>' +
      '<p class="muted" style="margin:0">Accedi per vedere e modificare il tuo calendario.</p>' +
      '<button type="button" class="btn primary" id="fb-login">Accedi con Google</button>' +
      '<p class="muted" id="fb-err" style="margin:0;font-size:13px"></p>' +
      '</div></div>';
    document.body.appendChild(wrap);
    wrap.querySelector('#fb-login').addEventListener('click', function () {
      wrap.querySelector('#fb-err').textContent = '';
      onClick().catch(function (e) {
        wrap.querySelector('#fb-err').textContent = 'Accesso non riuscito. Riprova.';
        console.error(e);
      });
    });
    return wrap;
  }

  async function connectFirebase(cfg) {
    var base = 'https://www.gstatic.com/firebasejs/' + FB_VERSION + '/';
    await loadScript(base + 'firebase-app-compat.js');
    await Promise.all([loadScript(base + 'firebase-auth-compat.js'), loadScript(base + 'firebase-firestore-compat.js')]);
    var app = firebase.initializeApp(cfg);
    var auth = app.auth(), fs = app.firestore();

    var account = await new Promise(function (resolve) {
      var screen = null;
      auth.onAuthStateChanged(function (u) {
        if (u) { if (screen) screen.remove(); resolve(u); }
        else if (!screen) {
          screen = signInScreen(function () { return auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); });
        }
      });
    });

    /* il nome dell'account viene salvato sul proprio calendario, così l'altra persona lo vede */
    try { await fs.doc('cal/' + account.uid).set({ name: account.displayName || '' }, { merge: true }); } catch (e) {}

    var user = {
      me: function () { return Promise.resolve({ id: account.uid, name: account.displayName || '', isOwner: true }); },
      profiles: async function (ids) {
        var out = {};
        await Promise.all(ids.map(async function (id) {
          try { var s = await fs.doc('cal/' + id).get(); if (s.exists) out[id] = { name: s.data().name || '', color: '' }; } catch (e) {}
        }));
        return out;
      }
    };
    return { db: fs, user: user, mode: 'firebase', signOut: function () { return auth.signOut().then(function () { location.reload(); }); } };
  }

  /* ---------------- punto d'ingresso ---------------- */
  var active = null;
  window.CalendarBackend = {
    connect: async function () {
      var cfg = (window.CALENDAR_CONFIG || {}).firebase;
      if (cfg && cfg.apiKey && cfg.projectId) active = await connectFirebase(cfg);
      else active = { db: LocalStore(), user: localUser, mode: 'local' };
      return active;
    },
    signOut: function () { if (active && active.signOut) return active.signOut(); }
  };
})();
