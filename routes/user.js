const express = require('express')
const router = express.Router()
const user = require('../model/usermodel')
const userAuth = require('../middlewares/userauth')
const cartcontroller = require('../controller/cartcontroller')
const ordercontroller = require('../controller/ordercontroller')
const usercontroller = require('../controller/usercontroller')
const cart = require('../model/cartmodel')

router.get('/home',usercontroller.viewproduct)

router.get('/login',userAuth.authmiddleware,usercontroller.login)
router.post('/login',usercontroller.postlogin)

router.get('/signup',userAuth.authmiddleware,usercontroller.signup)
router.post('/signup',usercontroller.logged)

router.get('/emailverification',userAuth.authmiddleware,usercontroller.getemailverification)
router.post('/emailverification',usercontroller.otpAuth,usercontroller.postemailverification)

router.get('/resendotp',userAuth.authmiddleware,usercontroller.resendotp)


router.get('/forgotpassword',userAuth.authmiddleware,usercontroller.getforgotpassword)
router.post('/forgotpassword',usercontroller.postforgotpassword)

router.get('/forgototp',userAuth.authmiddleware,usercontroller.getforgototp)
router.post('/forgototp',usercontroller.postforgototp)

router.get('/forgotpasscheck',userAuth.authmiddleware,usercontroller.getforgotpasscheck)
router.post('/forgotpasscheck',usercontroller.postforgotpasscheck)

router.get('/usershop',userAuth.userexist,usercontroller.getusershop)
router.get('/usershop/category/:id',userAuth.userexist,usercontroller.getusershop)
router.get('/usershop/brand/:id',userAuth.userexist,usercontroller.getusershop)

router.get('/logout',usercontroller.logout)

router.get('/product/:id',userAuth.userexist,usercontroller.getproduct)

router.get('/addtocart/:id',userAuth.userToken,cartcontroller.getusercart)

router.get('/cart',userAuth.userToken,cartcontroller.getcartinside)
router.post('/cart',userAuth.userToken,cartcontroller.postcart)

router.get('/profilecart',cartcontroller.getprofilecart)

router.post('/updateQuantity',cartcontroller.updatingquantity)

router.get('/removefromcart/:id',userAuth.userToken,cartcontroller.getremovefromcart)

router.get('/addaddress',userAuth.userToken,usercontroller.getaddaddress)
router.post('/addaddress',userAuth.userToken,usercontroller.postaddaddress)

router.post('/addaddress-checkout',userAuth.userToken,usercontroller.getaddaddresscheckout)

router.post('/editaddress/:id',userAuth.userToken,usercontroller.posteditaddress)

router.get('/deleteaddress/:id',userAuth.userToken,usercontroller.getdeleteaddress)

router.get('/checkout',userAuth.userToken,cartcontroller.getcheckout)
router.post('/checkout',userAuth.userToken,cartcontroller.postcheckout)

router.get('/ordersuccess',userAuth.userToken,cartcontroller.getordersuccess)

router.get('/orderhistory',ordercontroller.getuserorderhistory)

module.exports = router