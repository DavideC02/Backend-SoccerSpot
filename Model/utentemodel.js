const mongoose = require("mongoose") // Backend: importo mongoose per creare schema e modello
const bcrypt = require("bcrypt")     // Backend: libreria per hash e confronto delle password

// Definizione dello schema utente
const utenteschema = new mongoose.Schema({ 

    // Nome dell'utente
    nome : {
        type : String,
        required : [true, "Nome Obbligatorio"]  
    },
    
    // Cognome dell'utente
    cognome : {
        type : String,
        required : [true, "Cognome obbligatorio"]
    },

    // Email (identificatore unico dell'utente)
    email : {
        type : String,
        required : [true, "Email obbligatoria"]
        // NOTE: meglio aggiungere unique:true e validazione regex per email
    },

    // Password
    password : {
        type : String,
        required : [true, "Password Obbligatoria"],
        minlength : [8,"Minimo 8 caratteri"] // Lunghezza minima
        // Non memorizziamo mai la password in chiaro: viene hashata con bcrypt
    },
    
    // Ruolo dell'utente → per differenziare funzionalità
    ruolo : {
        type : String,
        enum : ["utente", "proprietario"], // Solo due ruoli ammessi
        required : [true, "inserire se si è utente o proprietario"]
    },

    // Data di creazione account
    creatoil : {
        type : Date,
        default : Date.now // Impostata automaticamente
    }
})

// Middleware pre-save → viene eseguito PRIMA di salvare l'utente nel database
utenteschema.pre('save', async function(next){

    // Se la password NON è stata modificata, non la ri-hashiamo
    if(!this.isModified('password')){
        next()
    }

    try{
        // Hash della password con "saltRounds = 10"
        // In pratica trasforma la password in una stringa sicura che non può essere invertita
        this.password = await bcrypt.hash(this.password,10)
        next()
    }
    catch(error){
        next(error) // In caso di errore interrompe il salvataggio
    }
})

// Metodo custom per confrontare password
// Viene richiamato dai controller al login
utenteschema.methods.comparapassword = async function(orapassword){
    // Confronta la password inserita dall’utente con quella hashata salvata nel DB
    return bcrypt.compare(orapassword, this.password)
}

// Creazione del modello "User" a partire dallo schema
module.exports = mongoose.model("User", utenteschema)