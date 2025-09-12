const Campo = require("../Model/campomodel.js")
const User = require("../Model/utentemodel.js")


exports.principale = async (req,res) => {

    try {
        const {comune} = req.params
        const campi = await Campo.find({comune : comune});
        res.json(campi)
    }
    
    catch(error){
        return res.status(500).json()
    }
}


exports.creacampo = async (req,res) => {
    
    console.log("Sono entrato in creacampo", req.body, req.user);

    try{
        const {imgUrl,nome,comune,indirizzo,numerotelefono} = req.body
        const authid = req.user.id

         const newcampo = await Campo.create({
            img: Array.isArray(imgUrl) ? imgUrl : [imgUrl],
            nome,
            comune,
            indirizzo,
            proprietario : authid,
            numerotelefono
        })
         res.status(201).json({message : "campo creato", campo : newcampo})
    }
    catch(error){
        return res.status(500).json({message:"Errore del server"})
    }
}


exports.deletecampo = async (req,res) => {

    try{
        const campoid = req.params.campoid
        const userID = req.user.id

        const campo = await Campo.findById(campoid)

        if(!campo){
            return res.status(404).json({message : "Campo non trovato"})
        }

        
        if(campo.proprietario.toString() !== userID.toString()){ 
            
            return res.status(403).json({message : "Non autorizzato"})
        }

        await Campo.findByIdAndDelete(campo)  

        res.json({message : "Elimiato con successo"})

    }
    
    catch(error){
        return res.status(500).json({message : "Errore del server"})
    }
}


exports.update = async (req,res) => {

    try{

        const campoid = req.params.campoid
        const userid = req.user.id
        const {indiceimg, img ,numerotelefono} = req.body;

        const campo = await Campo.findById(campoid)

        if(!campo){
            return res.status(404).json({message: "campo non trovato"})
        }

        
        if(campo.proprietario.toString() !== userid.toString()){
            return res.status(403).json({message : "accesso negato"})
        }
        
        if(indiceimg !== undefined && img){
            if(campo.img && campo.img.length > indiceimg)
            campo.img[indiceimg] = img
        }
        else{
            return res.status(400).json({message : "Indice Immagine non valido"})
        }

        if(numerotelefono !== undefined){
            campo.numerotelefono = numerotelefono
        }

        await campo.save();

        res.json({message : "Aggiornato con successo", campo})
    }
    
    catch(error){

        console.error(error);
        return res.status(500).json({error : "Errore del server"})
    }
}


exports.agpref = async (req,res) => {

    try{
        const campoid = req.params.campoid
        const userid = req.user.id

         const campo = await Campo.findById(campoid)

    
         if(!campo){
            return res.status(404).json()
         }

         if (!Array.isArray(campo.likes)) {
                campo.likes = [];
        }

        const index = campo.likes.findIndex(id => id.toString() == userid)

        if(index == -1){
            campo.likes.push(userid)
            await campo.save();
            return res.json({
                message : "Like Aggiunto",
                campo :campo
            })
        }
         else{
            campo.likes = campo.likes.filter(id => id.toString() !== userid)
            await campo.save();
            return res.json({
                message : "Like Rimosso",
                campo : campo
            })
        }
    }
    catch(error){
        console.error(error)
        return res.status(500).json({error : "errore del server"})
    }
}