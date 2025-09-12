const Pren = require("../Model/prenotazioni")
const Campo = require("../Model/campomodel")

exports.creapren = async (req,res) => {

    try{
        const {campoid} = req.body
        const userid = req.user.userid

        const {inizio, fine, note} = req.body

        const campo = await Campo.findById(campoid)
        if(!campo){
            return res.status(404).json({message : "Campo non trovato"})
        }

        const start = new Date(inizio)
        const end = new Date(fine)

        if(end <= start){
            return res.status(400).json({message : "La fine deve essere successiva all inizio"})
        }

        const libero = Pren.findOne({
            campo : campoid,
            stato : "attivo",
            inizio : {$gt:end},
            fine : {$lt:start}
        })

        if(!libero){
            return res.status(409).json({message : "Slot Occupato"})
        }

        const nuovapren = await Pren.create({
            campo : campoid,
            utente : userid,
            inizio : start,
            fine : end,
            note : note || undefined
        })

        res.status(201).json({message : "Prnotato con successo", prenotazione : nuovapren})
    }catch(err){
        return res.status(500).json({message : "Errore del server"})
    }
}

exports.cancellapren = async (req,res) => {

    try{
        const {prenid} = req.body
        const userid = req.user.id

        const prenota = Pren.findById(prenid)
        if(!prenota){
            return res.status(404).json({message : "Prenotazione non trovato"})
        }

        if(prenota?.utente != userid){
            return res.status(401).json({message : "Non Autorizzato"})
        }

        if(prenota.stato !== "attiva"){
            return res.status(400).json({message : "Già Cancellata"})
        }

        prenota.stato = "cancellato"
        await prenota.save()

        res.json(201).json({message : "Cancellata", prenotazione : prenota})

    }catch(err){
        return res.status(500).json({message : "Errore del server"})
    }
}

exports.miepren = async (req,res) => {
    try{
        userid = req.user.id

        const pren = await prenotazioni.find({utente : userid}).populate("campo", "nome comune indirizo")
        if(!pren){
            returnres.status(404).json({})
        }

        res.json(pren)
    }catch(err){
        return res.status(500)
    }
}