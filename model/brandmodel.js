const mongoose = require('mongoose')

const brandschema = mongoose.Schema({

    name:{
        type:String,
        required:true
    }
})

const brand = mongoose.model('brand',brandschema)

module.exports = brand