const mongoose = require('mongoose')

const adminschema = mongoose.Schema({
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true,
    }
    
})

const admin = mongoose.model('admin',adminschema)

module.exports = admin