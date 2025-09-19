const express = require("express")          // Backend: importo express
const router = express.Router();            // Creo un router per raggruppare le rotte legate all'autenticazione

const authcont = require("../Controller/auth.js") // Importo il controller dell’autenticazione (registrazione, login, ecc.)
const {verificatoken} = require("../Middlware/authmiddle.js") // Middleware che verifica il token JWT (popola req.user)

// ------------------- ROTTE AUTENTICAZIONE -------------------

// Registrazione nuovo utente
// Frontend → invia nome, cognome, email, password, ruolo
// Backend → crea un utente in DB, hash password, ritorna messaggio di conferma
router.post("/registrazione", authcont.registrautente)

// Login utente
// Frontend → invia email e password
// Backend → controlla credenziali, genera access token e refresh token
router.post("/login", authcont.login)

// Logout
// Frontend → invia richiesta per chiudere sessione
// Backend → elimina refresh token dal DB e cancella cookie httpOnly
router.post("/logout", authcont.logout)

// Refresh token
// Frontend → non invia nulla, il cookie httpOnly con refresh token viene mandato automaticamente
// Backend → valida refresh token, genera nuovo access token
router.post("/refreshtoken", authcont.refreshtoken)

// Aggiornamento profilo utente
// Frontend → invia dati aggiornati (nome, cognome, email, password)
// Backend → solo se l’utente è autenticato (verificatoken), aggiorna i dati nel DB
router.put("/profilo", verificatoken, authcont.aggiornautente)

// ------------------------------------------------------------

// Esporto il router per usarlo in app.js/server.js
module.exports = router
