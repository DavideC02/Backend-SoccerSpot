const express = require("express")
const router = express.Router();
const authcont = require("../Controller/auth.js")

router.post("/registrazione", authcont.registrautente)

router.post("/login", authcont.login)

router.post("/logout", authcont.logout)

router.post("/refreshtoken", authcont.refreshtoken)

module.exports = router
