/*
 * Configurazione del calendario.
 *
 * Senza configurazione l'app funziona in MODALITÀ LOCALE: gli impegni vengono
 * salvati nel browser (localStorage) e restano su questo dispositivo.
 *
 * Per usare il calendario in due, su più dispositivi e con sincronizzazione in
 * tempo reale, crea un progetto Firebase (Firestore + Authentication con Google)
 * e incolla qui sotto la configurazione web del progetto. Vedi il README.
 */
window.CALENDAR_CONFIG = {
  firebase: null
  /* Esempio:
  firebase: {
    apiKey: "...",
    authDomain: "tuo-progetto.firebaseapp.com",
    projectId: "tuo-progetto",
    appId: "..."
  }
  */
};
