const express = require("express")
const router = express.Router()
const prenmiddle = require("../Controller/prenotazionemiddle")
const {verificatoken} = require("../Middlware/authmiddle")

router.post("/", verificatoken, prenmiddle.creapren)

router.delete("/:prenid", verificatoken, prenmiddle.cancellapren)

router.get("/miepren", verificatoken, prenmiddle.miepren)

module.exports = router