const Campo = require("../Model/campomodel.js") // Backend: modello Mongoose per i "campi" (documenti nel DB)
const User = require("../Model/utentemodel.js") // Backend: modello utente (qui serve soprattutto per riferimenti/permessi)


// GET /campi/:comune  → restituisce tutti i campi di un comune specifico
exports.principale = async (req,res) => {

    try {
        const {comune} = req.params // Frontend → Backend: parametro route (es. /campi/Bari)
        const campi = await Campo.find({comune : comune}); // Backend: query MongoDB filtrando per comune
        res.json(campi) // Backend → Frontend: array di campi (la UI li renderizza in lista/card)
    }
    
    catch(error){
        return res.status(500).json() // Backend → Frontend: errore generico (suggerito inviare un messaggio)
    }
}


// POST /campi  → crea un nuovo campo (auth richiesta)
exports.creacampo = async (req,res) => {
    
    console.log("Sono entrato in creacampo", req.body, req.user); // Debug server: verifica payload e utente autenticato

    try{
        // Frontend → Backend: invia nel body i dati del nuovo campo
        const {imgUrl,nome,comune,indirizzo,numerotelefono} = req.body
        const authid = req.user.id // Backend: ID dell’utente autenticato (da middleware auth con JWT)

         const newcampo = await Campo.create({
            img: Array.isArray(imgUrl) ? imgUrl : [imgUrl], // Backend: normalizza immagini a un array
            nome, // Nome del campo
            comune, // Comune (chiave di ricerca principale)
            indirizzo, // Indirizzo testuale
            proprietario : authid, // Relazione: il creatore diventa proprietario del campo
            numerotelefono // Contatto telefonico
        })
         res.status(201).json({message : "campo creato", campo : newcampo}) // Backend → Frontend: conferma + documento creato
    }
    catch(error){
        return res.status(500).json({message:"Errore del server"}) // Backend → Frontend: errore generico
    }
}


// DELETE /campi/:campoid  → elimina un campo se l’utente è il proprietario
exports.deletecampo = async (req,res) => {

    try{
        const campoid = req.params.campoid // Frontend → Backend: id del campo nella route
        const userID = req.user.id // Backend: id utente da JWT (middleware auth)

        const campo = await Campo.findById(campoid) // Backend: carica il campo dal DB

        if(!campo){
            return res.status(404).json({message : "Campo non trovato"}) // Backend → Frontend: resource not found
        }

        // Autorizzazione: solo il proprietario può cancellare
        if(campo.proprietario.toString() !== userID.toString()){ 
            return res.status(403).json({message : "Non autorizzato"}) // Backend → Frontend: forbidden
        }

        await Campo.findByIdAndDelete(campoid)  // Backend: elimina il documento

        res.json({message : "Elimiato con successo"}) // Backend → Frontend: la UI può togliere il card dalla lista

    }
    
    catch(error){
        return res.status(500).json({message : "Errore del server"}) // Backend → Frontend: errore generico
    }
}


// PATCH /campi/:campoid  → aggiorna immagine (per indice) e/o numero di telefono (solo proprietario)
exports.update = async (req,res) => {

    try{

        const campoid = req.params.campoid // Frontend → Backend: id campo nella route
        const userid = req.user.id // Backend: id utente da JWT (middleware auth)
        const {indiceimg, img ,numerotelefono} = req.body; // Frontend → Backend: destruutura i dati aggiornati

        const campo = await Campo.findById(campoid) // Backend: carica campo

        if(!campo){
            return res.status(404).json({message: "campo non trovato"}) // Backend → Frontend: not found
        }

        // Autorizzazione: solo il proprietario può modificare
        if(campo.proprietario.toString() !== userid.toString()){
            return res.status(403).json({message : "accesso negato"}) // Backend → Frontend: forbidden
        }
        
        // Aggiornamento immagine per indice specifico
        if(indiceimg !== undefined && img){
            if(campo.img && campo.img.length > indiceimg) // Backend: controlla che l’indice esista
                campo.img[indiceimg] = img // Backend: sostituisce l’URL all’indice richiesto
        }
        else{
            return res.status(400).json({message : "Indice Immagine non valido"}) // Backend → Frontend: bad request (input incompleto/errato)
        }

        // Aggiorna numero di telefono se presente
        if(numerotelefono !== undefined){
            campo.numerotelefono = numerotelefono
        }

        await campo.save(); // Backend: salva le modifiche

        res.json({message : "Aggiornato con successo", campo}) // Backend → Frontend: rimanda doc aggiornato per sincronizzare la UI
    }
    
    catch(error){

        console.error(error); // Log server
        return res.status(500).json({error : "Errore del server"}) // Backend → Frontend: errore generico
    }
}


// POST /campi/:campoid/like  → toggle preferito (aggiunge/rimuove like dell’utente)
exports.agpref = async (req,res) => {

    try{
        const campoid = req.params.campoid // Frontend → Backend: id campo nella route
        const userid = req.user.id // Backend: id utente da JWT (middleware auth)

        const campo = await Campo.findById(campoid) // Backend: recupera il campo

        if(!campo){
            return res.status(404).json() // Backend → Frontend: not found (suggerito aggiungere messaggio)
        }

        if (!Array.isArray(campo.likes)) { // Hardening: assicura che likes sia un array
            campo.likes = [];
        }

        const index = campo.likes.findIndex(id => id.toString() == userid) // Backend: verifica se l’utente ha già messo like

        if(index == -1){ // Se non presente → aggiungi like
            campo.likes.push(userid) // Backend: push id utente in likes
            await campo.save(); // Salvataggio
            return res.json({
                message : "Like Aggiunto", // Backend → Frontend: la UI può illuminare l’icona “preferito”
                campo :campo // Ritorna il campo aggiornato (conta like aggiornata)
            })
        }
        else{ // Se presente → rimuovi like
            campo.likes = campo.likes.filter(id => id.toString() !== userid) // Backend: togli id utente dall’array
            await campo.save(); // Salvataggio
            return res.json({
                message : "Like Rimosso", // Backend → Frontend: la UI disattiva lo stato “preferito”
                campo : campo
            })
        }
    }
    catch(error){
        console.error(error) // Log server
        return res.status(500).json({error : "errore del server"}) // Backend → Frontend: errore generico
    }
}


// GET /campi/preferiti  → restituisce tutti i campi “likati” dall’utente corrente
exports.alllike = async (req,res) => {

    try{
        const userid = req.user.id // Backend: id utente da JWT (middleware auth)

        const preferiti = await Campo.find({ likes : userid }) // Backend: query su array 'likes' che contiene l'id utente

        return res.json(preferiti); // Backend → Frontend: lista dei campi preferiti per render nella pagina Preferiti
    }
    catch(error){
        return res.status(500).json({error : "errore del server"}); // Backend → Frontend: errore generico
    }
}