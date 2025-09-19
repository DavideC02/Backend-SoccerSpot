const express = require("express")                  // Backend: importo express
const router = express.Router()                     // Creo un router dedicato alle rotte di prenotazione

const prenmiddle = require("../Controller/prenotazionemiddle") // Controller con la logica delle prenotazioni
const {verificatoken} = require("../Middlware/authmiddle")     // Middleware per verificare il token JWT e popolare req.user

// ------------------- ROTTE PRENOTAZIONI -------------------

// Crea una nuova prenotazione
// Frontend → POST /prenotazioni con { campoid, inizio, fine, note? } e Authorization: Bearer <accessToken>
// Backend → verifica token (req.user.id), controlla disponibilità, crea la prenotazione con utente = req.user.id
router.post("/", verificatoken, prenmiddle.creapren)

// Cancella una prenotazione esistente
// Frontend → DELETE /prenotazioni/:prenid con Authorization: Bearer <accessToken>
// Backend → verifica token (req.user.id), controlla che la prenotazione appartenga a quell’utente, imposta stato = "cancellata"
router.delete("/:prenid", verificatoken, prenmiddle.cancellapren)

// Recupera tutte le prenotazioni dell’utente corrente
// Frontend → GET /prenotazioni/miepren con Authorization: Bearer <accessToken>
// Backend → usa req.user.id per cercare tutte le prenotazioni legate all’utente e le restituisce (anche array vuoto)
router.get("/miepren", verificatoken, prenmiddle.miepren)

// ----------------------------------------------------------

// Esporto il router per collegarlo in server.js con app.use("/prenotazioni", router)
module.exports = router
