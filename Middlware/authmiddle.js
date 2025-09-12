const jwt = require("jsonwebtoken")
const User = require("../Model/utentemodel.js")

const verificatoken = (req,res,next) => {

    const header = req.headers.Authorization || req.headers.authorization
      console.log("Header Authorization ricevuto:", req.headers.authorization);


    if(!header || !header.startsWith('Bearer ')){

        return res.status(401).json({message : "Token Mancante o malfatto"})
    }

    const token = header.split(' ')[1];

    
    jwt.verify(token, process.env.TOKEN_ACCESSO, (err,decoded) => {

        if(err){

            console.error("Errore di verifica")
            return res.status(403).json({message : "Token non valido"})
        }

        req.user = { 
            id: decoded.userId,
            ruolo : decoded.ruolo
        }; 
        console.log("Token verificato, passo al controller");

        next();
    })
}

module.exports = {verificatoken};