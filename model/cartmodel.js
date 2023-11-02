const mongoose = require('mongoose');
const Product = require('./productmodel');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userId: {   
        type: Schema.Types.ObjectId, 
        required: true, 
        unique: true 
    },
    
    products: [{
        productId:{type:Schema.Types.ObjectId,ref:"Product"},
        Quantity:{type:Number},
    }],

    TotalAmount:{
        type:Number,
    }
    


})

const cart = mongoose.model('cart',cartSchema)

module.exports = cart