const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Types.ObjectId,
        required:true,
        ref:"Product"
    },
    userId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref: "user"
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    reviewText:{
        type:String,
        required:true,
    }
});

const review = mongoose.model('review',reviewSchema)
module.exports = review