const mongoose = require('mongoose')

const categoryschema = mongoose.Schema({

    name:{
        type:String,
        unique:true,
        required:true
    },

    imageUrl:{
        type:String,
        unique:true,
        
    },
    Status:{
        type:String,
        required:true
    }
});

const category = mongoose.model('category',categoryschema)

module.exports = category