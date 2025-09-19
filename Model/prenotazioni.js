const mongoose = require("mongoose") // Backend: importo mongoose per definire schema e modello

// Definizione dello schema per una prenotazione
const prenotazioneschema = new mongoose.Schema({

    // Riferimento al campo prenotato
    campo : {
        type : mongoose.Schema.Types.ObjectId, // Oggetto MongoDB Id
        ref : "Campo"                          // Collegamento alla collezione Campo (per populate)
    },

    // Riferimento all'utente che ha effettuato la prenotazione
    utente : {
        type : mongoose.Schema.Types.ObjectId, // Oggetto MongoDB Id
        ref : "User"                           // Collegamento alla collezione User (per populate)
    },

    // Orario di inizio della prenotazione
    inizio : {
        type : Date,
        required : true                        // Obbligatorio: il Frontend deve sempre inviarlo
    },

    // Orario di fine della prenotazione
    fine : {
        type : Date,
        required : true,                       // Obbligatorio: il Frontend deve sempre inviarlo
        validate : {                           // Validazione custom: la fine deve essere dopo l'inizio
            validator : function(orafine){
                return this.inizio && orafine > this.inizio
            },
            message : "La fine deve essere dopo l'inizio" // Backend → Frontend: messaggio di errore
        }
    },

    // Stato della prenotazione
    stato : {
        type : String,
        enum : ["attivo", "cancellato", "completata"], // Valori ammessi
        default : "attiva" // ⚠️ BUG: il default non è coerente con l'enum ("attiva" non è incluso). Meglio "attivo".
    },

    // Note opzionali lasciate dall'utente (es. richieste particolari)
    note : {
        type : String,
        maxlength : [300, "Max 300 caratteri"] // Lunghezza massims delle note
                                               // e 300 come valore minimo, quando volevi massimo 300 caratteri
    },

    // Data di creazione della prenotazione
    creatoil : {
        type : Date,
        default : Date.now                     // Backend: la imposta automaticamente al momento della creazione
    }
})

// Creazione del modello "Prenotazione"
module.exports = mongoose.model("Prenotazione", prenotazioneschema)