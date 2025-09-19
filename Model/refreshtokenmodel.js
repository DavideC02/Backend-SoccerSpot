const mongoose = require("mongoose") // Backend: importo mongoose per definire schema e modello

// Schema per gestire i refresh token
const rtokenschema = new mongoose.Schema({
    
    // Stringa del refresh token
    token : {
        type : String,   // Backend: contiene il JWT di refresh generato al login
        unique : true,   // Non possono esistere due documenti con lo stesso token
        required : true  // Obbligatorio
    },

    // Utente associato al token
    userId : {
        type : mongoose.Schema.Types.ObjectId, // Riferimento a un documento della collezione User
        ref : "User",                          // Riferimento a modello User
        required : true                        // Ogni refresh token deve appartenere a un utente
    },

    // Data di creazione del token
    creatoil : {
        type : Date,
        default : Date.now                     // Backend: lo imposta automaticamente alla creazione
    }
})

// Creazione del modello "RefreshToken" collegato allo schema
module.exports = mongoose.model("RefreshToken", rtokenschema);
