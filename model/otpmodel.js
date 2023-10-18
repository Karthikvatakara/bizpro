const mongoose = require('mongoose')

const otpschema = mongoose.Schema({
    email:{
        type:String,
        unique:true
    },
    otp:{
        type:String,
    },
    createdAt:{
        type:Date
    },
    expiresAt:{
        type:Date
    }
})

const OTP = mongoose.model('OTP',otpschema)

module.exports = OTP