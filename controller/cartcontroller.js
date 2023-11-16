const categoryModel = require('../model/categorymodel')
const brandModel = require('../model/brandmodel')
const userModel = require('../model/usermodel')
const cartModel = require('../model/cartmodel')
const productModel = require('../model/productmodel')
const usermodel = require('../model/usermodel')
const ordermodel = require('../model/ordermodel')
const moment  = require('moment')
const nodemailer = require('nodemailer')
const Razorpay = require('../validator/razorpay')
const razorpay = require('razorpay')
const crypto = require('crypto')
const mongoose = require("mongoose");


const getusercart = async(req,res)=> {
    try{
        // console.log('hai');
        const userId = req.session.user._id
        const productId = req.params.id;
        console.log(userId,'TEST1');
        const usercart = await cartModel.findOne({userId:userId})
        // console.log(usercart);
        if(usercart === null) {
            const newusercart = new cartModel({
                userId:userId,
                products:[{
                    productId:productId,
                    Quantity:1
                }],
            });
            await newusercart.save()
        }else{
            const product = usercart.products.find(product => product.productId.equals(productId));
            console.log(product);
            if (!product) {
                usercart.products.push({
                    productId: productId,
                    Quantity: 1
                });
            } else {
                const quantity = product.Quantity
                console.log(quantity);
                const newproduct = await productModel.findOne({_id:productId})
                // console.log(newproduct);
                if(quantity == newproduct.AvailableQuantity) {
                    await cartModel.findOneAndUpdate({'userId':userId,'products.productId':productId},{$inc:{'products.$.Quantity':0}})
                    return res.redirect('/cart')

                }
                await cartModel.findOneAndUpdate({'userId':userId,'products.productId':productId},{$inc:{'products.$.Quantity':1}})
            }
            await usercart.save();
        }     
       res.redirect('/cart')

    }catch(error){
        console.log(error);
    }
}


const updatingquantity = async (req, res) => {
    try {
      const { productId, change } = req.body;

      const userId = req.session.user._id;

      const userCart = await cartModel.findOne({ userId: userId });
      const product = await productModel.findById(productId);
      if (!userCart || !product) {
        return res.status(404).json({ error: "Product or cart not found" });
      }
      const cartItem = userCart.products.find((item) =>
        item.productId.equals(productId)
      );
      if (!cartItem) {
        return res.status(404).json({ error: "Product or cart not found" });
      }
      const newQuantity = cartItem.Quantity + parseInt(change);
      if (newQuantity < 1) {
        userCart.products = userCart.products.filter(
          (item) => !item.productId.equals(productId)
        );
      } else {
        cartItem.Quantity = newQuantity;
      }

      await userCart.save();
      res.json({ message: "Quantity updated successfully", newQuantity });
    } catch (error) {
      console.error("Error updating quantity:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  const getcartinside = async(req,res) => {
    try{
        const error = req?.query?.error;
        const message = req?.query?.message;
        if(error){
          req.flash('error', message);
        }
        const cart = await cartModel.findOne({userId:req.session.user._id}).populate('products.productId')
        res.render('user/cart',{user:req.session.user,cart,messages:req.flash()})
    }catch(error){
      console.log(`an error happened ${error}`);
    }
  }

  const getcartinsideForSafeer = async(req,res) => {
    try{
        const cart = await cartModel.findOne({userId:req.session.user._id}).populate('products.productId')
        res.render('user/cart',{user:req.session.user,cart,messages:req.flash()})
    }catch(error){
      console.log(`an error happened ${error}`);
    }
  }

  const getremovefromcart = async(req,res) => {
    try{
      const product = await cartModel.findOneAndUpdate({userId:req.session.user._id},{$pull:{products:{productId:req.params.id}}}) 
    //    console.log(product);
    res.redirect('/cart/')
    }catch(error){
        console.log(error);
    }
  }

  const getcheckout = async(req,res) => {
    try{
      const user = await usermodel.findById(req.session.user._id)
      const cart = await cartModel.findOne({userId:req.session.user._id})
      // console.log(cart.products);
      const havingProducts = cart?.products?.length || 0;
      if(havingProducts >0) {
      res.render('user/checkout',{user})
      }else {
        req.flash('error',"no products in the cart")
        res.redirect('/cart')
      }
    }catch(error){
      console.log(error);
    }
  }

  const postcart = async(req,res) => {
    try{
      
      req.session.totalPrice = req.body.totalPrice
      const cartProduct = await cartModel.findOne({userId:req.session.user._id})
      
      let isRedirected = false

      for(const product of cartProduct.products) {
        cartquantity = product.Quantity
        
        const Product = await productModel.findOne({_id:product.productId})
        // console.log(Product);

        if(!product) {
          req.flash('error',"product not found")
          isRedirected = true;
          break;
        }

        if(cartquantity >Product.AvailableQuantity || Product.AvailableQuantity ==0){
          // console.log(Product.AvailableQuantity);
          req.flash('error',"the product is out of stock")
          isRedirected = true
          break;
        }
      };

      if(isRedirected) {
        return res.redirect('/cart')
      }
      res.redirect('/checkout')
      
    }catch(error){
      console.log(error);
    }
  }


  const postcheckout = async(req,res) =>{
    try{
      let redirected = false;
      console.log(req.body);
      const { AddressId,paymentMethod} = req.body
      
      const cart = await cartModel.findOne({userId:req.session.user._id})
      console.log(cart,"gorhoihoihoihyh");

      for(const product of cart.products){
        console.log("in for");
        cartQuantity = product.Quantity                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        const Product = await productModel.findOne({_id:product.productId})
        if(!Product) {
          console.log('there is no product');
          req.flash('error','product is not available')
          redirected = true
          res.json({status: false, url: '/cart', error: true, message:'product is not available'});   
        }
        else if(cartQuantity > Product.AvailableQuantity || Product.AvailableQuantity == 0) {
          console.log('in else');
          req.flash('error','products is not available')
          console.log(req.flash());

          redirected = true
          res.json({status: false, url: '/cart'});   
        }
      }

      // console.log(cart);
      if (redirected === false ) {
  
      const userId = req.session.user._id
      const products = cart.products
      const TotalPrice = req.session.totalPrice
      const address = await usermodel.findOne({_id:req.session.user._id, 'Address._id':AddressId},{'Address.$':1})
      const Address = {
        Name:address.Address[0].Name,
        AddressLane:address.Address[0].AddressLane,
        City:address.Address[0].City,
        Pincode:address.Address[0].Pincode,
        State:address.Address[0].State,
        Mobile:address.Address[0].Mobile
      }

      const neworders = new ordermodel({
        userId:req.session.user._id,
        products:cart.products,
        PaymentMethod:paymentMethod,
        TotalPrice:req.session.totalPrice,
        Address:Address,
        OrderDate:moment(new Date()).format('llll'),
        ExpextedDeliveryDate:moment().add(4,"days").format('llll')
      })
      // console.log(neworders);
      console.log("ivide ethi karthik");
    if(paymentMethod === 'cod'){
      
      const orders = await neworders.save()

      const deletedcart = await cartModel.findByIdAndDelete(cart._id)   
    // console.log(orders);

    for(const product of orders.products){
      console.log(product._id,"PRODUCT ID");
      console.log(product.Quantity,"PRODUCT QUANTITY");
      const Product = await productModel.findById(product.productId)
      if(Product){
        const newQuantity = Product.AvailableQuantity - product.Quantity
        // console.log(newQuantity);
        if(newQuantity <= 0) {
          Product.AvailableQuantity = 0;
          Product.Status = "OUT OF STOCK"
          await Product.save();
        }else{
          Product.AvailableQuantity =Product.AvailableQuantity - product.Quantity
          await Product.save();
        }
      }else{
        req.flash("error","product is not found")
        res.json({status:false,url:'/cart'})
      }
    }
    

        const user = req.session.user
        const email = req.session.user.email
      const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'karthikbrototype@gmail.com',
            pass: 'belj vqwu rxtc bmjr',
          },
        })
       
        ///otp sending
        const maildata = {
          from:'karthikbrototype@gmail.com',
          to:email,
          subject:"OTP FROM BIZPRO",
          html: `<p>otp from bizpro</p> <p style="color:tomato; font-size:25px; letter-spacing:3px"><b>Hello ${user.name} Your order has been received and will be processed within one bussiness Day .your total price is ${req.session.totalPrice}</b></p>`
        }

        transporter.sendMail(maildata,(error,info) => {
          if(error) {
            console.log(email,"haiiiiiii");
              return console.log(error);
          }
        })
        console.log("reaching hhhhhhhhai");
        res.json({status:false,codsuccess:true,url:'/ordersuccess'})

      }else if(paymentMethod ==='online'){
        
        const orders = await neworders.save()  ///order is placed//

        const orderdetails =  {
          amount:orders.TotalPrice,
          receipt:orders._id,
        }
        const user = await usermodel.findOne({_id:req.session.user._id})
        const order = await Razorpay.createRazorpayOrder(orderdetails)
        console.log(order,"hiiiiii");
        
        
        for(const product of orders.products){
          console.log(product._id,"PRODUCT ID");
          console.log(product.Quantity,"PRODUCT QUANTITY");
          const Product = await productModel.findById(product.productId)
          if(Product){
            const newQuantity = Product.AvailableQuantity - product.Quantity
            // console.log(newQuantity);
            if(newQuantity <= 0) {
              Product.AvailableQuantity = 0;
              Product.Status = "OUT OF STOCK"
              await Product.save();
            }else{
              Product.AvailableQuantity =Product.AvailableQuantity - product.Quantity
              await Product.save();
              const deletedcart = await cartModel.findByIdAndDelete(cart._id)   //cart deleted//
            }
          }else{
            req.flash("error","product is not found")
            res.rediret('/cart')
          }
          console.log(order,user)
          res.json({status: true,order,user})
        }


      }else if(paymentMethod === "wallet"){
        // console.log(req.session.totalPrice);
        const user = await usermodel.findOne({_id:req.session.user._id})
        // console.log(user.WalletAmount)
        const totalPrice = req.session.totalPrice
        const WalletAmount = user.WalletAmount
        console.log(WalletAmount);
        if(WalletAmount >= totalPrice){
          const orders = await neworders.save() 

          for(const product of orders.products){
            console.log(product._id,"PRODUCT ID");
            console.log(product.Quantity,"PRODUCT QUANTITY");
            const Product = await productModel.findById(product.productId)
            if(Product){
              const newQuantity = Product.AvailableQuantity - product.Quantity
              // console.log(newQuantity);
              if(newQuantity <= 0) {
                Product.AvailableQuantity = 0;
                Product.Status = "OUT OF STOCK"
                req.flash('error',"product is out of stock")
                await Product.save();
              }else{
                Product.AvailableQuantity =Product.AvailableQuantity - product.Quantity
                await Product.save();
              }
            }else{
              req.flash("error","product is not found")
              res.json({status:false,url:'/cart'})
            }
          }

         
          const deletedcart = await cartModel.findByIdAndDelete(cart._id)   //cart deleted//

          res.json({status:true,codsuccess:true,url:'/ordersuccess'})
          const remainingAmount = WalletAmount-totalPrice
          const user = await usermodel.findByIdAndUpdate(req.session.user._id,{WalletAmount:remainingAmount})
          const order = await ordermodel.findOneAndUpdate({_id:orders._id},{PaymentStatus:"paid"})
          console.log(user);
          console.log(order);
        }else{
          console.log("jjjjjj");
          req.flash("error",`the wallet contains only ${WalletAmount} rupees`)
          res.json({status:false,url:'/cart'})
        }
      }}

    }catch(error){
      console.log(error);
    }
  }


  const getordersuccess = async(req,res) => {
    try{
      const user = await userModel.findOne({_id:req.session.user._id})
      res.render('user/ordersuccess',{user})
    }catch(error){
      console.log(error);
    } 
  }

  const getprofilecart = async(req,res) =>{
    try{
      const user = await usermodel.findOne({_id:req.session.user._id})
      const cart = await cartModel.findOne({userId:req.session.user._id}).populate('products.productId')
      
      res.render('user/profilecart',{user,cart})
    }catch(error){
      console.log(error);
    }
  }


  const postverifypayment = async(req,res) =>{
    try{
      console.log(req.body,"verifypayment");
      function generateSignature(data, secret) {
        const hmac = crypto.createHmac('sha256', 'kI2Wwrnm0R3qsx0GbvgrErXm');
        hmac.update(data);
        return hmac.digest('hex');
    }
      console.log("reached");
      const generatedSignature = generateSignature(req.body.payment.razorpay_order_id + "|" + req.body.payment.razorpay_payment_id,'kI2Wwrnm0R3qsx0GbvgrErXm')
      // console.log(req.body);
      // console.log(generatedSignature);
      // console.log(req.body.payment.razorpay_signature);
      if(generatedSignature === req.body.payment.razorpay_signature){
        const orderId = new mongoose.Types.ObjectId( req.body.order.receipt);
        const updatedorder = await ordermodel.findByIdAndUpdate(orderId,{PaymentMethod:"online",PaymentStatus:"paid",Status:"Order Placed"})
        console.log(updatedorder);
        const deletedcart = await cartModel.findOneAndDelete({userId:req.session.user._id})
        console.log(updatedorder);
        res.json({success:true, url:'/ordersuccess'})
      }else{
        res.status(403).json({success:false,error:"invalid signature"})
      }
    }catch(error){
      console.log(error);  
    }
  }

module.exports = {
  getusercart, 
  updatingquantity, 
  getremovefromcart,
  getcartinside, 
  getcheckout, 
  postcart, 
  postcheckout,
  getordersuccess, 
  getprofilecart, 
  postverifypayment, 
  getcartinsideForSafeer
}