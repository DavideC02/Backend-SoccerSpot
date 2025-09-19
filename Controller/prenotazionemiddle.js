const Pren = require("../Model/prenotazioni"); // Backend: importa il modello Mongoose delle prenotazioni
const Campo = require("../Model/campomodel");   // Backend: importa il modello Mongoose dei campi prenotabili

// Stati coerenti in tutto il codice
const STATO_ATTIVA = "attiva";      // Backend: costante per lo stato "attiva" di una prenotazione
const STATO_CANCELLATA = "cancellata"; // Backend: costante per lo stato "cancellata" di una prenotazione

// POST /prenotazioni
exports.creapren = async (req, res) => { // Backend: endpoint che crea una nuova prenotazione
  try {
    const { campoid, inizio, fine, note } = req.body; // Frontend → Backend: il client invia id campo, orari e note
    const userid = req.user.id; // Backend: id utente autenticato messo dal middleware di autenticazione

    if (!campoid || !inizio || !fine) { // Backend: validazione presenza campi obbligatori
      return res.status(400).json({ message: "Dati mancanti" }); // Backend → Frontend: errore input
    }

    const campo = await Campo.findById(campoid); // Backend: verifica che il campo esista a database
    if (!campo) {
      return res.status(404).json({ message: "Campo non trovato" }); // Backend → Frontend: risorsa inesistente
    }

    const start = new Date(inizio); // Backend: normalizza l’orario di inizio a oggetto Date
    const end = new Date(fine);     // Backend: normalizza l’orario di fine a oggetto Date
    if (isNaN(start) || isNaN(end)) { // Backend: controlla che le date siano valide
      return res.status(400).json({ message: "Formato data non valido" }); // Backend → Frontend: errore formato
    }
    if (end <= start) { // Backend: impedisce intervalli non corretti
      return res.status(400).json({ message: "La fine deve essere successiva all'inizio" }); // Backend → Frontend
    }

    // Sovrapposizione corretta:
    // Cerchiamo se ESISTE già una prenotazione "attiva" che si sovrappone all’intervallo richiesto [start, end).
    // Condizione di overlap: existing.inizio < end  E  existing.fine > start
    const occupato = await Pren.findOne({
      campo: campoid,             // Filtra per lo stesso campo
      stato: STATO_ATTIVA,        // Considera solo prenotazioni attive
      inizio: { $lt: end },       // Inizia prima che finisca il nuovo intervallo
      fine:   { $gt: start }      // Finisce dopo che inizia il nuovo intervallo
    });

    if (occupato) { // Backend: se c’è sovrapposizione, slot non disponibile
      return res.status(409).json({ message: "Slot occupato" }); // Backend → Frontend: conflitto, scegliere altro orario
    }

    const nuovapren = await Pren.create({ // Backend: crea il documento di prenotazione
      campo: campoid,         // Relazione: campo prenotato
      utente: userid,         // Relazione: utente che prenota
      inizio: start,          // Orario di inizio normalizzato
      fine: end,              // Orario di fine normalizzato
      note: note || undefined,// Opzionale: note aggiuntive
      stato: STATO_ATTIVA     // Stato iniziale della prenotazione
    });

    return res.status(201).json({ message: "Prenotato con successo", prenotazione: nuovapren }); // Backend → Frontend: esito positivo
  } catch (err) {
    return res.status(500).json({ message: "Errore del server" }); // Backend → Frontend: errore generico
  }
};

// DELETE /prenotazioni/:id
exports.cancellapren = async (req, res) => { // Backend: endpoint che annulla una prenotazione esistente
  try {
    const { prenid } = req.body; // Frontend → Backend: il client indica quale prenotazione annullare (id)
    const userid = req.user.id;  // Backend: id dell’utente autenticato

    if (!prenid) { // Backend: validazione presenza id prenotazione
      return res.status(400).json({ message: "prenid mancante" }); // Backend → Frontend
    }

    const prenota = await Pren.findById(prenid); // Backend: carica la prenotazione da DB
    if (!prenota) {
      return res.status(404).json({ message: "Prenotazione non trovata" }); // Backend → Frontend: inesistente
    }

    if (prenota.utente.toString() !== userid.toString()) { // Backend: autorizzazione, deve essere il proprietario
      return res.status(401).json({ message: "Non autorizzato" }); // Backend → Frontend: non possiede la prenotazione
    }

    if (prenota.stato !== STATO_ATTIVA) { // Backend: può annullare solo se ancora attiva
      return res.status(400).json({ message: "Prenotazione già cancellata" }); // Backend → Frontend
    }

    prenota.stato = STATO_CANCELLATA; // Backend: cambia lo stato a cancellata
    await prenota.save();              // Backend: persiste la modifica

    return res.status(200).json({ message: "Cancellata", prenotazione: prenota }); // Backend → Frontend: conferma annullamento
  } catch (err) {
    return res.status(500).json({ message: "Errore del server" }); // Backend → Frontend
  }
};

// GET /prenotazioni/mie
exports.miepren = async (req, res) => { // Backend: endpoint che restituisce tutte le prenotazioni dell’utente corrente
  try {
    const userid = req.user.id; // Backend: utente autenticato

    const pren = await Pren.find({ utente: userid }) // Backend: trova tutte le prenotazioni legate all’utente
      .populate("campo", "nome comune indirizzo")    // Backend: include dati base del campo utile alla vista lato client
      .sort({ inizio: 1 });                          // Backend: ordina per data di inizio crescente

    return res.status(200).json(pren); // Backend → Frontend: array di prenotazioni (anche vuoto)
  } catch (err) {
    return res.status(500).json({ message: "Errore del server" }); // Backend → Frontend
  }
};