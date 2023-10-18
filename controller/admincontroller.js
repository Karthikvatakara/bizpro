const productModel = require('../model/productmodel')
const categoryModel = require('../model/categorymodel')
const brandModel = require('../model/brandmodel')
const userModel = require('../model/usermodel')
const moment = require('moment')
const usermodel = require('../model/usermodel')
const adminModel = require('../model/adminmodel')
const bcrypt = require('bcrypt')


const getuserlist = async(req,res) => {
    const searchQuery = req.query.search || '';
    const page = parseInt(req.query.page) || 1; // Current page (default to 1)
    const perPage = parseInt(req.query.limit) || 10;

    try{

        const filter = {};
        if(searchQuery) {
            filter.name = { $regex: new RegExp(searchQuery,'i')};
        }
       console.log(filter)

      const skip = (page - 1) * perPage;

      const users = await userModel.find(filter).skip(skip).limit(perPage);
      const totalCount = await userModel.countDocuments(filter);

        res.render('admin/manageusers',{users,currentPage:page,perPage,totalCount,totalPages:Math.ceil(totalCount/perPage),searchQuery})
    }catch(error){
        console.log(error);
        res.redirect('/admin/manageusers')
    }
}


const userblock = async(req,res) => {
    try{
        // console.log(req.params.id)
        const user = await userModel.findById({_id:req.params.id})
        // console.log(user);
        if(user.Status == 'Active') {
            const user = await userModel.findByIdAndUpdate({_id:req.params.id},{Status:'Blocked'})
        }else if(user.Status == 'Blocked') {
            const user = await userModel.findByIdAndUpdate({_id:req.params.id},{Status:'Active'})
        }
        // console.log(user.Status);
        res.redirect('/admin/userlist')
        }catch(error){
        console.log(error);
    }   
}

const getadminlogin = async(req,res) => {
    try{
        res.render('admin/adminlogin')
    }catch(error){
        console.log(error);
    }
}

// admin logged
// const postadminlogin = async(req,res) => {
//     try{
//         console.log(req.body);
//         req.body.password = await bcrypt.hash(req.body.password,10)
//         const admin = await adminModel.create(req.body)
//         res.send("admin logged")
//     }catch(error){
//         console.log(error);
//     }
// }

const postadmincheck = async(req,res) => {
    try{
        // console.log(req.body);
        const admin = await adminModel.findOne({email:req.body.email})   
        if(admin) {
            passwordmatch = await bcrypt.compare(req.body.password,admin.password)

            if(passwordmatch) {
                req.session.adminAuth = true
                res.redirect('/admin/adminshowproduct')
            } else{
                res.redirect('/admin/adminlogin')
            }
        } else{
            res.redirect('/admin/adminlogin')
        }    
    }catch(error){
        console.log(error);
        res.redirect('/admin/adminlogin')
    }
}

const adminlogout = async(req,res) => {
    try{
        req.session.adminAuth = false
        res.redirect('/admin/adminlogin')
    }catch(error){
        console.log(error);
    }
}





module.exports = {getuserlist,userblock,getadminlogin,postadmincheck,adminlogout}