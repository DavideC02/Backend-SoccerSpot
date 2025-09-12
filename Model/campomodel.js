const mongoose = require("mongoose")

const camposchema = new mongoose.Schema({

    img : {
        type : [String],
        validate : [
            {
                validator : array => array.length > 0,
                message : "Almeno 1 immagine"
            },

            {
                validator : array => array.length <= 5,
                message : "Massimo 5 immagini "
            }
        ]
    },

    nome : {
        type : String,
        required : [true, "Obbligatorio"]
    },

    comune : {
        type : String,
        required : [true, "Obbligatorio"]
    },

    indirizzo : {
        type : String,
        required : [true , "Obbligatorio"]
    },

    
    proprietario : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : "User"
    },
    
    
    numerotelefono : {
        type : String,
        required : [true, "Obbligatorio"],
        minlength : [10, "Minimo 10 numeri"]
    },

    
    likes : [{

        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        default : []
    }]
})

module.exports = mongoose.model("Campo", camposchema)
