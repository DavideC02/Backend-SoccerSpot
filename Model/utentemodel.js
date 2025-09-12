const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const utenteschema = new mongoose.Schema({ 

     nome : {
        type : String,
        required : [true, "Nome Obbligatorio"]  
    },
    
    cognome : {
        type : String,
        required : [true, "Cognome obbligatorio"]
    },

    
    email : {
        type : String,
        required : [true, "Email obbligatoria"]
    },

     password : {
        type : String,
        required : [true, "Password Obbligatoria"],
        minlength : [8,"Minimo 8 caratteri"]
    },
    
    ruolo : {
        type : String,
        enum : ["utente", "proprietario"],
        required : [true, "inserire se si è utente o proprietario"]
    },

    
    creatoil : {
        type : Date,
        default : Date.now
    }

})

utenteschema.pre('save', async function(next){

    if(!this.isModified('password')){
        next()
    }

    try{
        this.password = await bcrypt.hash(this.password,10)
        next()
    }
    catch(error){
        next(error)
    }
})


utenteschema.methods.comparapassword = async function(orapassword){
    return bcrypt.compare(orapassword, this.password)
}

module.exports = mongoose.model("User", utenteschema)