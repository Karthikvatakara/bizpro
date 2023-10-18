const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const adminmodel = require('../model/adminmodel')
// const usercontroller = require('../controller')
const productcontroller = require('../controller/productcontroller')
const admincontroller = require('../controller/admincontroller')
// const upload = multer({dest:'uploads/'})
const adminAuth = require('../middlewares/adminauth')



router.get('/adminaddproduct',adminAuth.authmiddleware,productcontroller.getadminaddproduct)
router.post('/adminaddproduct',upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1}]),productcontroller.postadminaddproduct)

router.get('/addcategory',adminAuth.authmiddleware,productcontroller.getaddcategory)
router.post('/addcategory',upload.single('imageUrl'),productcontroller.postaddcategory)

router.get('/addbrands',adminAuth.authmiddleware,productcontroller.getaddbrands)
router.post('/addbrands',productcontroller.postaddbrands)

router.get('/editcategory/:id',adminAuth.authmiddleware,productcontroller.geteditcategory)
router.post('/editcategory/:id',upload.single('imageUrl'),productcontroller.posteditcategory)

router.get('/categoriesandbrands',adminAuth.authmiddleware,productcontroller.getcategoriesandbrands)

router.get('/adminshowproduct',adminAuth.authmiddleware,productcontroller.getadminshowproduct)

router.get('/editproduct/:id',adminAuth.authmiddleware,productcontroller.geteditproduct)
router.post('/editproduct/:id',upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1}]),productcontroller.posteditproduct)

router.get('/adminproduct/:id',adminAuth.authmiddleware,productcontroller.getadminproduct)

router.get('/userlist',adminAuth.authmiddleware,admincontroller.getuserlist)
router.get('/userlist/:id',adminAuth.authmiddleware,admincontroller.userblock)

router.get('/adminlogin',adminAuth.adminexist,admincontroller.getadminlogin)
router.post('/adminlogin',admincontroller.postadmincheck)

router.get('/deletecategory/:id',productcontroller.getdeletecategory)

router.get('/adminlogout',admincontroller.adminlogout)

module.exports = router 
