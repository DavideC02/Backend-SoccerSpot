require ('dotenv').config() // Backend: carica le variabili d'ambiente da un file .env (PORT, DB_STRING, TOKEN_ACCESSO, ecc.)

const express = require("express")     // Backend: framework per creare API e gestire richieste HTTP
const mongoose = require("mongoose")   // Backend: ODM per connettersi a MongoDB
const cors = require("cors")           // Middleware: serve per abilitare richieste cross-origin (es. da frontend React)
const cookieParser = require("cookie-parser") // Middleware: serve a leggere i cookie inviati dal client (es. refresh token)

// Importo i router definiti per le varie funzionalità
const authroutes = require("./Route/authroute.js")       // Rotte di autenticazione (registrazione, login, logout, refresh, profilo)
const camporoutes = require("./Route/camporoute.js")     // Rotte per i campi (CRUD, preferiti, like)
const prenotaroute = require("./Route/prenotaroute.js")  // Rotte per le prenotazioni (crea, cancella, miepren)

// Inizializzo l’app Express
const app = express();

const PORT = process.env.PORT // Porta di ascolto presa da .env (es. 3000)

// Configurazione CORS
app.use(cors({
    origin : true,        // Permette a qualunque origine di fare richieste (puoi specificare il dominio del frontend per più sicurezza)
    credentials :  true   // Permette l’invio di cookie e header di autenticazione
}))

// Middleware globali
app.use(express.json())   // Backend: per parsare automaticamente il body JSON delle richieste
app.use(cookieParser())   // Backend: per leggere e scrivere cookie (es. refresh token httpOnly)

// Registro i router con i prefissi
// Frontend → farà richieste a queste rotte
app.use("/api/auth", authroutes)          // Tutte le rotte di autenticazione avranno prefisso /api/auth
app.use("/api/campo", camporoutes)        // Tutte le rotte di gestione campo avranno prefisso /api/campo
app.use("/api/prenotazioni", prenotaroute)// Tutte le rotte di prenotazione avranno prefisso /api/prenotazioni

// Connessione a MongoDB
mongoose.connect(process.env.DB_STRING) // Legge stringa di connessione da .env
const db = mongoose.connection

// Una volta connessi al DB, avvia il server HTTP
db.once('open', () => {
    app.listen(PORT, () => console.log("App connessa e in ascolto"))
})