const mongoose = require("mongoose") // Backend: importiamo mongoose per definire schema e modello

// Definizione dello schema di un "Campo" prenotabile
const camposchema = new mongoose.Schema({

    // Array di immagini (URL o percorsi)
    img : {
        type : [String], // Array di stringhe
        validate : [     // Validazioni custom sull’array
            {
                validator : array => array.length > 0, // Deve esserci almeno una immagine
                message : "Almeno 1 immagine"
            },
            {
                validator : array => array.length <= 5, // Non più di 5 immagini per campo
                message : "Massimo 5 immagini "
            }
        ]
    },

    // Nome del campo
    nome : {
        type : String,
        required : [true, "Obbligatorio"] // Frontend: se manca, riceve errore di validazione
    },

    // Comune in cui si trova il campo
    comune : {
        type : String,
        required : [true, "Obbligatorio"]
    },

    // Indirizzo del campo
    indirizzo : {
        type : String,
        required : [true , "Obbligatorio"]
    },

    // Proprietario del campo (utente che lo ha creato)
    proprietario : {
        type : mongoose.Schema.Types.ObjectId, // Riferimento a un documento della collezione User
        ref : "User" // Permette di usare .populate("proprietario") nei controller per avere i dati utente
    },
    
    // Numero di telefono per contatti/prenotazioni
    numerotelefono : {
        type : String,
        required : [true, "Obbligatorio"], // Campo obbligatorio
        minlength : [10, "Minimo 10 numeri"] // Deve essere almeno di 10 caratteri
    },

    // Array di utenti che hanno messo "mi piace" (preferiti)
    likes : [{
        type : mongoose.Schema.Types.ObjectId, // Ogni elemento è un id utente
        ref : "User",                          // Permette populate per sapere chi ha messo il like
        default : []                           // Se non specificato → array vuoto
    }]
})

// Creazione del modello "Campo" a partire dallo schema
module.exports = mongoose.model("Campo", camposchema)