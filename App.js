require ('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const authroutes = require("./Route/authroute.js")
const camporoutes = require("./Route/camporoute.js")
const prenotaroute = require("./Route/prenotaroute.js")

const app = express();

const PORT = process.env.PORT

app.use(cors({
    origin : true,
    credentials :  true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authroutes)
app.use("/api/campo", camporoutes)
app.use("/api/prenotazioni", prenotaroute)

mongoose.connect(process.env.DB_STRING)
const db = mongoose.connection


db.once('open', () => {
    app.listen(PORT, () => console.log("App connessa e in ascolto"))
})