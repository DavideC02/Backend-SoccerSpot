const express = require("express")
const router = express.Router();
const {verificatoken} = require("../Middlware/authmiddle.js")
const campomiddle = require("../Controller/campomiddle.js")

router.get("/:comune", campomiddle.principale)

router.post("/", verificatoken, campomiddle.creacampo)

router.delete("/:campoid", verificatoken, campomiddle.deletecampo)

router.put("/:campoid", verificatoken, campomiddle.update)

router.put("/:campoid/like",verificatoken, campomiddle.agpref)

module.exports = router