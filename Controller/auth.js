const jwt = require("jsonwebtoken")
const User = require("../Model/utentemodel.js")
const RefreshToken = require("../Model/refreshtokenmodel.js")


const generatoken = (utente) => {
    const tokenaccesso = jwt.sign(
    {
        userId : utente._id,
        ruolo: utente.ruolo
    }, 
    process.env.TOKEN_ACCESSO, 
    {expiresIn : "15min"}
    )
    const refreshtoken = jwt.sign(
        {
            userId : utente._id,
            ruolo: utente.ruolo
        },
        process.env.TOKEN_REFRESH,
        {expiresIn : "7d"}
    )

    console.log("TOKEN ACCESSO GENERATO:", tokenaccesso);
    console.log("REFRESH TOKEN GENERATO:", refreshtoken);
    return {tokenaccesso, refreshtoken};
}


exports.registrautente = async (req,res) => {

    try{
        const {nome,cognome,email,password,ruolo} = req.body

        const esiste = await User.findOne({email})
        
        if(esiste){
            return res.status(400).json({message : "Utente già esistente"})
        }
        
        //primo modo
        //const newuser = new User({nome,cognome,email,password,ruolo})
        //await newuser.save();
        //secondo modo
        await User.create({nome,cognome,email,password,ruolo})



        res.status(202).json({message : "Utente registrato"})
    }
     catch(error){
         return res.status(500).json({message: "Errore del serve"})
    }
}


exports.login = async (req,res) => {

    try{
           const {email,password} = req.body

           const user = await User.findOne({email})
           
           if(!user){
                 return res.status(404).json({message : "Utente non trovato"})
           }

           const accesso = await user.comparapassword(password)

           if(!accesso){
                return res.status(401).json({message : "Password Errata"})
            }

            const {tokenaccesso, refreshtoken} = generatoken(user)  

            await RefreshToken.create({token : refreshtoken, userId : user._id}) 

            
            res.cookie(
                'jwt', 
                refreshtoken, 
                {
                    httpOnly : true,
                    sameSite : 'Strict',
                maxAge : 7*24*60*60*1000
                }
            )

            
            res.json({
                message : "Login effetuato",
                tokenaccesso,
                 user : {
                    id : user.id,
                    nome : user.nome,
                    ruolo : user.ruolo
                 }
            })
            
        }    
        catch(error){
             return res.status(500).json({message : "Errore del server", error: error.message})
        }
}


exports.refreshtoken = async (req,res) => {

    const cookies = req.cookies

    const newrefresh = cookies.jwt 

    try{
        
        const dbrefresh = await RefreshToken.findOne({token : newrefresh})
        if(!dbrefresh){
            
            return res.status(403).json({message : "Token non trovato o scaduto"})
        }

        jwt.verify(newrefresh, process.env.TOKEN_REFRESH, async (error, decoded) => {
            if(error){
                return res.status(403).json({message : "Accesso negato"})
            }
            const newaccesso = jwt.sign(  
                { userId: decoded.userId, ruolo: decoded.ruolo },
                process.env.TOKEN_ACCESSO,
                {expireIn : "15min"}
            )
            res.json({accesstoken : newaccesso})
        })

        
    }
    
    catch(error){
            return res.status(500).json({message : "Errore del server"})
    }
}


exports.logout = async (req,res) => {

    const cookies = req.cookies

    const newrefresh = cookies.jwt

    try {

        await RefreshToken.deleteOne({token : newrefresh})

        
        res.clearCookie('jwt',{
            httpOnly : true,
            sameSite : 'Strict',
        })
        res.status(200).json({message : "Logout effetuato"})
    }
    catch(error){
            return res.status(500).json({message : "Errore del server", error: error.message})
    }
}