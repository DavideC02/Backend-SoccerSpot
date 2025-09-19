const express = require("express")                // Backend: importo express
const router = express.Router();                  // Creo un router dedicato alle rotte dei campi

const {verificatoken} = require("../Middlware/authmiddle.js") // Middleware per controllare il token JWT (popola req.user)
const campomiddle = require("../Controller/campomiddle.js")   // Controller con la logica per la gestione dei campi

// ------------------- ROTTE CAMPI -------------------

// Recupera tutti i campi messi nei "preferiti" dall'utente autenticato
// Frontend → richiesta GET con token valido
// Backend → legge req.user.id dal token, cerca tutti i campi dove l'utente è presente in likes[]
router.get("/preferiti", verificatoken, campomiddle.alllike)

// Recupera tutti i campi di un determinato comune
// Frontend → GET /campi/Bari (ad esempio)
// Backend → cerca i campi filtrati per comune e restituisce array
router.get("/:comune", campomiddle.principale)

// Crea un nuovo campo (solo utente autenticato, tipicamente "proprietario")
// Frontend → POST con dati del campo {img, nome, comune, indirizzo, telefono}
// Backend → associa automaticamente req.user.id come proprietario
router.post("/", verificatoken, campomiddle.creacampo)

// Elimina un campo esistente (solo il proprietario autenticato può farlo)
// Frontend → DELETE /campi/:campoid con token valido
// Backend → verifica che req.user.id corrisponda al proprietario del campo
router.delete("/:campoid", verificatoken, campomiddle.deletecampo)

// Aggiorna i dati di un campo (solo il proprietario)
// Frontend → PUT /campi/:campoid con i campi da modificare
// Backend → controlla autorizzazione con req.user.id e salva modifiche
router.put("/:campoid", verificatoken, campomiddle.update)

// Aggiunge o rimuove un "like" su un campo (toggle preferiti)
// Frontend → PUT /campi/:campoid/like
// Backend → controlla utente da req.user.id e aggiorna lista likes[]
router.put("/:campoid/like", verificatoken, campomiddle.agpref)

// ---------------------------------------------------

// Esporto il router per poterlo usare in app.js/server.js
module.exports = router
