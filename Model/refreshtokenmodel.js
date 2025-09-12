const mongoose = require("mongoose")

const rtokenschema = new mongoose.Schema({
    
    token : {
        type : String,
        unique : true,
        required : true
    },

     userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    },

    creatoil : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model("RefreshToken", rtokenschema);
