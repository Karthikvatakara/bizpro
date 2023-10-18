const express = require('express')
const router = express.Router()
const user = require('../model/usermodel')
const userAuth = require('../middlewares/userauth')

const usercontroller = require('../controller/usercontroller')

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


module.exports = router