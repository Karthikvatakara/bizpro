const mongoose = require('mongoose')

const Userschema = mongoose.Schema( {
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String
        
    },
    confirmpassword:{
        type:String
    },
    token:{
        type:String
    },
    Address: [{
        Name: {type: String},
        AddressLane: { type: String },
        City: { type: String },
        Pincode: { type: Number },
        State: { type: String },
        Mobile: { type: Number },
     }],
     Status:{
        type:String,
        default:'Active'
     },
     WalletAmount:{
        type:Number,
        default:0
     }
})

module.exports = mongoose.model("user" , Userschema)