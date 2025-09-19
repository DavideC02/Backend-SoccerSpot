const jwt = require("jsonwebtoken") // Backend: importa la libreria per lavorare con i JSON Web Token

// Middleware di verifica del token JWT
const verificatoken = (req,res,next) => {

    // Backend: legge l'header Authorization inviato dal Frontend
    // Frontend deve sempre mandare: "Authorization: Bearer <accessToken>"
    const header = req.headers.Authorization || req.headers.authorization
    console.log("Header Authorization ricevuto:", req.headers.authorization);

    // Se manca l'header o non è nel formato corretto → rifiuta la richiesta
    if(!header || !header.startsWith('Bearer ')){
        return res.status(401).json({message : "Token mancante o malformato"})
    }

    // Estrae il token dalla stringa "Bearer <token>"
    const token = header.split(' ')[1];

    // Verifica la validità del token usando la chiave segreta
    jwt.verify(token, process.env.TOKEN_ACCESSO, (err,decoded) => {
        if(err){
            console.error("Errore di verifica")
            return res.status(403).json({message : "Token non valido o scaduto"})
        }

        // Se il token è valido, il payload contiene userId e ruolo
        // Qui creiamo req.user e lo aggiungiamo all'oggetto request.
        // Da questo momento in poi, i controller potranno leggere req.user.id
        // per sapere chi ha fatto la richiesta (utente autenticato).
        // Questo evita di dover passare userId nel body o nei parametri:
        // il Backend si fida solo del token firmato.
        req.user = { 
            id: decoded.userId,   // identificativo dell'utente autenticato
            ruolo : decoded.ruolo // ruolo dell'utente (per autorizzazioni)
        }; 
        console.log("Token verificato, passo al controller");

        // Passa al prossimo middleware o al controller associato alla rotta
        next();
    })
}

module.exports = {verificatoken}; // Esporta il middleware per usarlo nelle rotte protette