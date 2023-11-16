const productModel = require('../model/productmodel')
const categoryModel = require('../model/categorymodel')
const brandModel = require('../model/brandmodel')
const userModel = require('../model/usermodel')
const moment = require('moment')
const usermodel = require('../model/usermodel')
const adminModel = require('../model/adminmodel')
const bcrypt = require('bcrypt')
const ordermodel = require('../model/ordermodel')
const reviewModel = require('../model/reviewmodel')

const getadminorders = async(req,res) => {
    try{
        const page = parseInt(req.query.page) || 1; // Current page (default to 1)
        const perPage = parseInt(req.query.limit) || 10;    
        const order = await ordermodel.find().sort({_id:-1})

        const totalCount = await ordermodel.countDocuments();
        const returnedCount = await ordermodel.aggregate([{$match:{Status:'return requested'}},{$count:'count'}])
        // console.log(returnedCount);
        const numberOfReturnRequest = returnedCount[0]?.count
        res.render("admin/adminorders",{order,currentPage:page,perPage,totalCount,totalPages:Math.ceil(totalCount/perPage),numberOfReturnRequest})
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
    if(neworder.PaymentMethod === 'cod'){
        neworder.PaymentStatus = 'pending'
    }
    
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
        const order = await ordermodel.find({userId:req.session.user._id}).sort({OrderDate:-1}).populate('products.productId')
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

const getuserorderdetails = async(req,res) =>{
    try{
        const order = await ordermodel.findOne({_id:req.params.id}).populate('products.productId')
        const user = await usermodel.findOne({_id:req.session.user._id})
        // console.log(user);
        res.render('user/orderdetails',{order,user})
    }catch(error){
        console.log(error);
    }
}

const getUserTrackOrderDetails = async(req,res) =>{
    try{
        
        const order = await ordermodel.findOne({userId:req.session.user._id}).sort({_id:-1})
        // console.log(order);
        const orderId = order._id
        // console.log(orderId);
        const user = await usermodel.findOne({_id:req.session.user._id})
        res.redirect(`/order/orderdetails/${orderId}`)
    }catch(error){
        console.log(error);
    }
}

const getuserordercancel = async(req,res) =>{
    try{
        const  checkavailability = async(Id) => {
        const Order = await ordermodel.findOne({_id:req.params.id})
        for(const product of Order.products) {
            const productData = await productModel.findOne({_id:product.productId})
            const updatedQuantity = productData.AvailableQuantity + product.Quantity
            const updatedProduct = await productModel.findOneAndUpdate({_id:product.productId},{AvailableQuantity:updatedQuantity})
        }

        console.log(Id);
        const order = await ordermodel.findOneAndUpdate({_id:Id},{Status:'Cancelled',PaymentStatus:'order cancelled'},{new:true})
        console.log(order.products);
    }
        // console.log(Order);
        const Order = await ordermodel.findOne({_id:req.params.id})
        if(Order.PaymentMethod === 'cod'){
        await checkavailability(req.params.id);
        res.redirect('/orderhistory')
        }else if(Order.PaymentMethod === "online" || Order.PaymentMethod === "wallet"){
        await checkavailability(req.params.id)
        const user = await usermodel.findByIdAndUpdate(req.session.user._id,{$inc:{WalletAmount:Order.TotalPrice}})
        console.log(user);
        console.log(user.WalletAmount);
        res.redirect('/orderhistory')
        }
        
    }catch(error){
        console.log(error);
    }
}

const postorderreturn = async(req,res) =>{
    try{
        // console.log(req.body);
        // console.log(req.params.id);  
        console.log("requested return");
        const returnedReason = req.body.returnReason.toString()
        const order = await ordermodel.findByIdAndUpdate(req.params.id,{returnReason:returnedReason,Status:'return requested'})
        // console.log(order);
        console.log("tttttttt");
        res.json({success:true})
    }catch(error){
        console.log(error);
    }
}

const getreturnrequest = async(req,res) =>{
    try{
        const Page = parseInt(req.query.page) || 1;   // Current page number
        const perPage = 10; // Number of items per page
        const skip = (Page -1)*perPage  // Calculate the number of items to skip

        const order = await ordermodel.find({Status:"return requested"}).skip(skip).limit(perPage)
        const totalCount = await ordermodel.countDocuments({Status:"return requested"})

        res.render('admin/returnrequests',{order,Page,skip,perPage,currentPage:Page,totalCount,totalPages : Math.ceil(totalCount/perPage)})
    }catch(error){
        console.log(error);
    }
}

const  postReturnRequestHandle = async(req,res) =>{
    try{
        console.log(req.body);
        const {input,orderId} = req.body
        
      
        if(input === 'accept') {
            const order = await ordermodel.findOne({_id:orderId}).populate('products.productId')
            const userId = order.userId
            if(order.PaymentStatus === 'paid'){
                const user = await usermodel.findOneAndUpdate({_id:userId},{$inc:{WalletAmount:order.TotalPrice}},{new:true})
                const Order = await ordermodel.findByIdAndUpdate(orderId,{PaymentStatus:"refunded",Status:"returned"},{new:true})

            console.log(order.products,"nnnnnnnnnn");
            order.products.forEach(async(item) => {
                const product = await productModel.findOneAndUpdate({_id:item.productId},{$inc:{AvailableQuantity:item.Quantity}})
                console.log(product);
            })
            }
        }else{
            const order = await ordermodel.findOneAndUpdate({_id:orderId},{Status:"return rejected"},{new:true})
        }
        res.json({succes:true})
    }catch(error){
        console.log(error);
    }
}

const postCancelReturnRequest = async(req,res) => {
    try{
    console.log("hi");
    const order = await ordermodel.findOneAndUpdate({_id:req.params.id},{Status:"Delivered"})
    res.json({success:true})
    }catch(error){
        console.log(error);
    }
}

const postReviewSubmit = async(req,res) =>{
    try{
        // console.log(req.params.id);
    console.log(req.body);
    const {rating,review,productId} = req.body
    // console.log(rating);
    const newReview = new reviewModel({
        productId: productId,
        userId: req.session.user._id,
        rating: rating,
        reviewText :review
    })
    newReview.save()
    res.json({success:true})
    }catch(error){
        console.log(error);
    }
}

const getMyReviews = async(req,res) =>{
    try{
    const user = await userModel.findOne({_id:req.session.user._id})    
    const review = await reviewModel.find({userId:req.session.user._id}).populate('productId')
    res.render('user/myreviews',{review,user})
    }catch(error){
        console.log(error);
    }
}

module.exports = { 
    getadminorders, 
    putupdateorderstatus,
    getorderdetails,
    getuserorderhistory,
    getuserorderdetails,
    getUserTrackOrderDetails, 
    getuserordercancel,
    postorderreturn, 
    getreturnrequest, 
    postReturnRequestHandle, 
    postCancelReturnRequest,    
    postReviewSubmit, 
    getMyReviews
    }