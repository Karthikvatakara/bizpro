const productModel = require('../model/productmodel')
const categoryModel = require('../model/categorymodel')
const brandModel = require('../model/brandmodel')
const userModel = require('../model/usermodel')
const moment = require('moment')
const usermodel = require('../model/usermodel')
const adminModel = require('../model/adminmodel')
const bcrypt = require('bcrypt')
const ordermodel = require('../model/ordermodel')

const getadminorders = async(req,res) => {
    try{
        const page = parseInt(req.query.page) || 1; // Current page (default to 1)
        const perPage = parseInt(req.query.limit) || 10;    
        const order = await ordermodel.find().sort({_id:-1})

        const totalCount = await ordermodel.countDocuments();

        res.render("admin/adminorders",{order,currentPage:page,perPage,totalCount,totalPages:Math.ceil(totalCount/perPage)})
    }catch(error){
        console.log(error);
    }
}

const putupdateorderstatus = async(req,res) =>{
try{
// console.log(req.params.id);
console.log(req.body);
const {status} = req.body
// console.log(status);
const neworder = await ordermodel.findByIdAndUpdate(req.params.id,{Status:status},{new:true});
// console.log(neworder);


if(status === 'Delivered'){
    console.log("test");
    neworder.PaymentStatus = 'paid'
}else if(status === 'Rejected'){
    neworder.PaymentStatus = 'order cancelled'
}else {
    neworder.PaymentStatus = 'pending'
}

await neworder.save();
console.log(neworder);

// const updatedOrder = await ordermodel.findById(req.params.id)
res.status(200).json({neworder})

}catch(error){
console.log(error);
}
}

const getorderdetails = async(req,res) =>{
    try{
        console.log(req.params.id);
        const order = await ordermodel.findById(req.params.id).populate('products.productId')
        // console.log(order);
        res.render('admin/adminorderviewdetails',{order})
    }catch(error){
        console.log(error);
    }
}

const getuserorderhistory = async(req,res)=>{
    try{
        const order = await ordermodel.find({userId:req.session.user._id}).populate('products.productId')
        const user = await usermodel.findOne({_id:req.session.user._id})

        const page = parseInt(req.query.page) || 1; // Current page (default to 1)
        const perPage = parseInt(req.query.limit) || 10;    
     

        // const order = await ordermodel.find().sort({_id:-1})

        const totalCount = await ordermodel.countDocuments();
        res.render('user/orderlist',{order,user,currentPage:page,perPage,totalCount,totalPages:Math.ceil(totalCount/perPage)})
    }catch(error){
        console.log(error);
    }
}

module.exports = {getadminorders,putupdateorderstatus,getorderdetails,getuserorderhistory}