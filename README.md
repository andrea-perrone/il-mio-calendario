# Il mio calendario

Un calendario personale e di coppia, pensato prima di tutto per lo smartphone.
Ogni persona ha il proprio calendario, vede gli impegni pubblici dell'altra, condivide
quelli fatti **insieme** e tiene per sé quelli **privati**. Si aggiunge un impegno
scrivendo una frase come *"Cena domani alle 20"*, e l'aspetto grafico si può
personalizzare con 18 temi, 13 set di caratteri e 6 stili per gli impegni.

È una web app senza build e senza dipendenze: HTML, CSS e JavaScript puri.
Funziona subito in locale (dati salvati nel browser) e, se vuoi usarla in due, si
collega a Firebase per la sincronizzazione in tempo reale.

**▶ Demo online: [andrea-perrone.github.io/il-mio-calendario](https://andrea-perrone.github.io/il-mio-calendario/)**
(in modalità locale: gli impegni che crei restano solo nel tuo browser)

---

## Indice

- [Caratteristiche](#caratteristiche)
  - [Tre viste](#tre-viste)
  - [Pubblico, privato e Insieme](#pubblico-privato-e-insieme)
  - [Inserimento rapido in linguaggio naturale](#inserimento-rapido-in-linguaggio-naturale)
  - [Impegni su più giorni e ripetizioni](#impegni-su-più-giorni-e-ripetizioni)
  - [Dettaglio, modifica ed eliminazione](#dettaglio-modifica-ed-eliminazione)
  - [Personalizzazione](#personalizzazione)
  - [Usabilità e accessibilità](#usabilità-e-accessibilità)
- [Avvio rapido](#avvio-rapido)
- [Modalità condivisa con Firebase](#modalità-condivisa-con-firebase)
- [Struttura del progetto](#struttura-del-progetto)
- [Modello dei dati](#modello-dei-dati)
- [Tecnologie](#tecnologie)

---

## Caratteristiche

### Tre viste

| Vista | Cosa mostra |
|---|---|
| **Mese** | Griglia mensile con un pallino colorato per ogni impegno (fino a 4, poi `+`). Toccando un giorno compare sotto l'elenco degli impegni di quel giorno; toccandolo di nuovo si apre la vista Giorno. In fondo, la sezione **In arrivo** con i prossimi 6 impegni dei 60 giorni successivi. |
| **Agenda** | Elenco continuo degli impegni a partire da oggi, raggruppati per giorno, con **ricerca** su titolo, luogo e note. Mostra 60 giorni e si estende di altri 60 con un tocco. |
| **Giorno** | Linea del tempo di 24 ore con gli impegni posizionati in base all'orario. Gli impegni sovrapposti vengono affiancati in colonne. Una linea indica l'ora attuale e la vista scorre automaticamente sull'ora corrente o sul primo impegno. Toccando uno spazio vuoto si crea un impegno a quell'ora (arrotondata alla mezz'ora). |

In tutte le viste:

- frecce e pulsante **Oggi** per spostarsi nel tempo, **swipe** orizzontale su mese e giorno;
- indicatori in tempo reale **"In corso"**, **"Tra 25 min"**, **"Tra 2 h"**; gli impegni già finiti oggi appaiono attenuati;
- **filtri** rapidi: *Tutti*, *Miei*, *[nome del partner]*, *Insieme* (Miei e Insieme si possono combinare);
- la vista e il filtro scelti vengono ricordati alla riapertura.

### Pubblico, privato e Insieme

Ogni impegno ha uno di tre livelli di visibilità:

| Tipo | Chi lo vede | Chi lo modifica | Aspetto |
|---|---|---|---|
| **Pubblico** | Tu e l'altra persona | Solo tu | Colore del proprietario |
| **Solo io** (privato) | Solo tu: per l'altra persona non esiste | Solo tu | Colore del proprietario a righe diagonali, con lucchetto |
| **Insieme** | Entrambi, in entrambi i calendari | Entrambi | Sfumatura tra i due colori |

Ogni persona sceglie il **proprio colore** (16 predefiniti o uno a piacere) e il **nome** con cui
l'altra la vede. Un impegno pubblico dell'altra persona si può **copiare nel proprio calendario**
con un tocco. Gli impegni Insieme ricordano chi li ha creati.

### Inserimento rapido in linguaggio naturale

Mentre scrivi il titolo, il calendario riconosce data e ora e compila i campi da solo,
mostrando un riepilogo ("Ho capito: giovedì 26 novembre · 20:00–21:00"). Le parole
riconosciute vengono tolte dal titolo al salvataggio, quindi *"Cena domani alle 20"*
diventa l'impegno **Cena**, domani dalle 20:00 alle 21:00.

Esempi di frasi comprese:

| Scrivi | Risultato |
|---|---|
| `Dentista venerdì alle 9:30` | il prossimo venerdì, 9:30–10:30 |
| `Calcetto martedì 21-23` | il prossimo martedì, 21:00–23:00 |
| `Riunione dalle 14 alle 16` | giorno selezionato, 14:00–16:00 |
| `Compleanno nonna 25 ottobre tutto il giorno` | 25 ottobre, tutto il giorno |
| `Visita il 12/3 ore 10` | 12 marzo, alle 10:00 |
| `Pizza stasera`, `Spesa dopodomani` | oggi / tra due giorni |
| `Bolletta il 15` | il 15 del mese (o del mese prossimo se è già passato) |

Se una data è già passata quest'anno viene spostata all'anno successivo. I campi
modificati a mano non vengono più sovrascritti dal riconoscimento automatico.

### Impegni su più giorni e ripetizioni

- **Un giorno**, **Di fila** (es. una vacanza dal 10 al 15) o **Sparsi** (giorni non consecutivi
  scelti toccandoli su un mini-calendario, es. tre turni nella stessa settimana).
- Gli impegni su più giorni mostrano *"giorno 2 di 5"*, *"Dalle 18:00"* il primo giorno e
  *"Fino alle 10:00"* l'ultimo.
- Da un impegno a giorni sparsi si può **togliere un solo giorno** senza toccare gli altri.
- Ripetizione **ogni giorno, settimana, mese o anno**. Le ricorrenze mensili su giorni che non
  esistono (es. il 31) vengono saltate nei mesi più corti invece di slittare.
- **Tutto il giorno** oppure orario di inizio e fine, con scorciatoie di durata
  (30 min, 1 h, 1 h ½, 2, 3, 4 ore). Cambiando l'inizio, la durata viene mantenuta.
- Date rapide: *Oggi*, *Domani*, dopodomani, *Sabato*, *Domenica*, *+1 settimana*.
- **Icona** opzionale tra 19 emoji, **luogo** (con collegamento diretto a Google Maps) e **note**.

### Dettaglio, modifica ed eliminazione

- Toccando un impegno si apre una scheda con data, orario, ripetizione, luogo, note e visibilità.
- **Duplica** per creare velocemente un impegno simile.
- **Elimina** con conferma e con **Annulla** nel messaggio che compare dopo: per qualche secondo
  l'impegno si può ripristinare.
- Si può cambiare il tipo di un impegno (es. da Pubblico a Insieme) e viene spostato di conseguenza.
- Messaggi di errore chiari in italiano (titolo mancante, ora di fine prima dell'inizio, ecc.).

### Personalizzazione

Dal pulsante con la tavolozza si apre il pannello **Personalizza**:

- **18 temi**: Laguna (chiaro/scuro automatico), Quaderno, Notte alpina, Tramonto, Bosco,
  Brutale, Terminale, Arcade, Lavanda, Ufficio, Mare, Caffè, Ghiaccio, Sole, Bianco e nero,
  Ciliegia, Ardesia, Menta. Ognuno definisce colori, raggi degli angoli, spessore dei bordi,
  caratteri e stile degli impegni.
- **13 set di caratteri** (Moderno, Editoriale, Elegante, Libro, Rotondo, Scritto a mano,
  Corsivo, Retrò, Pixel, Macchina da scrivere, Deciso, Pulito, Sistema), caricati da Google
  Fonts solo quando servono.
- **6 forme per gli impegni**: Barra, Pieno, Contorno, Pillola, Blocco, Punto.
- Ogni anteprima mostra il risultato prima di sceglierlo; **Ripristina** torna all'aspetto di base.

Tema, caratteri e forma sono preferenze personali: le vede solo chi le ha scelte.
Colore e nome, invece, sono visibili anche all'altra persona.

### Usabilità e accessibilità

- Layout a colonna singola ottimizzato per telefono (max 640 px), con supporto alle
  *safe area* di iPhone e pulsante **+** sempre raggiungibile col pollice.
- Pannelli a scomparsa dal basso (*bottom sheet*) con azioni principali sempre visibili.
- **Tema chiaro e scuro** automatico secondo le impostazioni del sistema.
- Ruoli ARIA, etichette per lettori di schermo, focus visibile, chiusura con **Esc**,
  rispetto di *prefers-reduced-motion*.
- Tutte le date e gli orari sono formattati in italiano con `Intl.DateTimeFormat`.
- Aggiornamento automatico ogni minuto (indicatori "In corso", linea dell'ora attuale).

---

## Avvio rapido

Non serve installare nulla. Basta servire la cartella con un qualsiasi server statico:

```bash
git clone https://github.com/andrea-perrone/il-mio-calendario.git
cd il-mio-calendario
npx serve .          # oppure: python -m http.server 8000
```

e aprire l'indirizzo indicato nel browser. Il progetto può essere pubblicato così com'è
anche su **GitHub Pages**, Netlify o qualsiasi hosting statico.

Senza configurazione il calendario parte in **modalità locale**: gli impegni vengono salvati
nel `localStorage` del browser, restano su quel dispositivo e si sincronizzano tra le schede
aperte. È la modalità ideale per provarlo o per un uso personale.

---

## Modalità condivisa con Firebase

Per usarlo in due, da più dispositivi e con aggiornamenti in tempo reale:

1. Crea un progetto su [Firebase](https://console.firebase.google.com/).
2. In **Authentication** abilita il provider **Google** e aggiungi il dominio da cui servi
   l'app tra i *domini autorizzati*.
3. In **Firestore Database** crea un database e incolla le regole del file
   [`firestore.rules`](firestore.rules), sostituendo i due indirizzi email di esempio con
   quelli delle persone che useranno il calendario.
4. In **Impostazioni progetto → Le tue app** registra un'app web e copia l'oggetto di
   configurazione in [`js/config.js`](js/config.js):

   ```js
   window.CALENDAR_CONFIG = {
     firebase: {
       apiKey: "...",
       authDomain: "tuo-progetto.firebaseapp.com",
       projectId: "tuo-progetto",
       appId: "..."
     }
   };
   ```

All'apertura comparirà la schermata **Accedi con Google**. Ogni persona autorizzata avrà il
proprio calendario; le regole di sicurezza garantiscono che:

- gli impegni pubblici siano leggibili da entrambi ma modificabili solo dal proprietario;
- gli impegni Insieme siano leggibili e modificabili da entrambi;
- impegni privati e preferenze grafiche siano accessibili solo al proprietario, anche a livello di server.

> La configurazione web di Firebase non è un segreto: la protezione dei dati è affidata alle
> regole di Firestore e all'elenco di email autorizzate.

---

## Struttura del progetto

```
il-mio-calendario/
├── index.html        # struttura della pagina e dei pannelli (editor, dettaglio, personalizza)
├── css/
│   └── style.css     # stile basato su variabili CSS (token di colore, raggi, caratteri)
├── js/
│   ├── config.js     # configurazione opzionale di Firebase
│   ├── store.js      # strato dati: archivio locale o Firestore, stessa interfaccia
│   └── app.js        # logica dell'app: viste, ricorrenze, editor, parser, temi
└── firestore.rules   # regole di sicurezza per la modalità condivisa
```

L'app non dipende dal backend: `store.js` espone un'interfaccia minima in stile Firestore
(`doc(path).get/set/update/delete`, `collection(path).onSnapshot`) e un oggetto `user`.
L'implementazione locale replica questa interfaccia su `localStorage`, quella condivisa usa
direttamente l'SDK di Firebase. Per collegare un altro backend basta scrivere un adattatore
con gli stessi metodi.

Tutto il sistema grafico è costruito su **variabili CSS** (`--bg`, `--surface`, `--accent`,
`--r`, `--f-display`, `--ev-bar`, …): un tema non è altro che un insieme di valori applicati
a `:root`, per questo il cambio di tema è istantaneo.

---

## Modello dei dati

| Percorso | Contenuto |
|---|---|
| `cal/{utente}` | Profilo del calendario: nome visualizzato, colore |
| `cal/{utente}/events/{id}` | Impegni pubblici dell'utente |
| `shared/{id}` | Impegni Insieme (campo `by` = chi l'ha creato) |
| `data/users/{utente}/{id}` | Impegni privati dell'utente |
| `data/users/{utente}/settings` | Tema, caratteri e forma scelti |

Ogni impegno ha questa forma:

```json
{
  "title": "Cena",
  "date": "2026-11-26",
  "endDate": "",
  "extraDates": [],
  "allDay": false,
  "start": "20:00",
  "end": "21:00",
  "place": "Trattoria da Mario",
  "notes": "",
  "emoji": "🍽️",
  "repeat": "none",
  "vis": "public"
}
```

`repeat` può valere `none`, `daily`, `weekly`, `monthly`, `yearly`; `endDate` è valorizzato per
gli impegni su più giorni consecutivi, `extraDates` per quelli su giorni sparsi.
Le occorrenze delle ripetizioni vengono calcolate al volo per l'intervallo visualizzato,
senza duplicare dati.

---

## Tecnologie

- **HTML, CSS e JavaScript** senza framework né passaggi di build
- **CSS custom properties**, `color-mix()`, `dvh`, `env(safe-area-inset-*)`
- **Intl.DateTimeFormat** per la localizzazione italiana
- Espressioni regolari Unicode per l'interpretazione delle frasi in italiano
- **Google Fonts** con caricamento su richiesta
- **Firebase** (Authentication + Cloud Firestore) opzionale per la modalità condivisa
