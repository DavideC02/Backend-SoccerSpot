const mongoose = require("mongoose")

const prenotazioneschema = new mongoose.Schema({

    campo : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Campo"
    },

    utente : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },

    inizio : {
        type : Date,
        required : true
    },

    fine : {
        type : Date,
        required : true,
        validate : {
            validator : function(orafine){
                return this.inizio && orafine > this.inizio
            },
            message : "La fine deve essere dopo l'inizio"
        }
    },

    stato : {
        type : String,
        enum : ["attivo", "cancellato", "completata"],
        default : "attiva"
    },

    note : {
        type : String,
        minlength : [300, "Max 300 caratteri"]
    },

    creatoil : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model("Prenotazione", prenotazioneschema)