const productModel = require('../model/productmodel')
const categoryModel = require('../model/categorymodel')
const brandModel = require('../model/brandmodel')
const userModel = require('../model/usermodel')
const moment = require('moment')
const mongoose = require('mongoose')


// const addproduct = async(req,res) =>{
//     try{
//         req.body.imageUrl = req.file.filename
//         console.log(req.file.filename);
//         const productdata = await productModel.create(req.body)

//             console.log(productdata);
//             // console.log(req.file,req.body);

//     if(productdata) {
//         res.redirect('/admin')
//     }
// }
//  catch(err) {
//     res.json("internal server error")
// }
// }


///get product from db
// const getproduct = async(req,res) => {
//     const product = await productModel.find()
//     // console.log(product[0].imageUrl);
//     if(product) {
//         res.render('admin/adminhome',{product})
//     }
// }


const getaddcategory = async(req,res) => {
    res.render('admin/addcategory')
}


const postaddcategory = async(req,res) => {
    try{
        req.body.imageUrl = req.file.filename
        console.log(req.file.filename);
        req.body.Status = 'Active'
        const categorydata = await categoryModel.create(req.body)
        console.log(categorydata);
        res.redirect('/admin/categoriesandbrands')

    }catch(error){
            req.flash("category added not completed")
            console.log(error);
            res.send("the category not added")
    }
}

const getcategoriesandbrands = async(req,res) => {
    try{
        const category = await categoryModel.find()
        const brand = await brandModel.find()
        res.render('admin/categoriesandbrands',{category,brand})
    }catch(error){
        console.log(error);
    }
}

const getaddbrands = async(req,res) => {
    try{
        res.render("admin/addbrands")
    }catch(error) {
        console.log("error");
    }
}

const postaddbrands = async(req,res) =>{
    try{
        const brand = await brandModel.create(req.body)
        console.log(brand);
        res.redirect('/admin/categoriesandbrands')
    }catch(error) {
        console.log(error);
    }
}

const geteditcategory = async(req,res) => {
    try{
        
        // res.render('admin/editcategory')
        // console.log(req.params.id);
        const category = await categoryModel.findOne({_id:req.params.id})
        console.log(category);
        res.render('admin/editcategory',{category})
    }catch(error){
        console.log(error);
    }
}

const posteditcategory = async(req,res) => {
    try{
        // console.log(req.params.id);
        // console.log(req.body);
        // console.log(req.file.filename);

        if(req.file) {
            const newname = req.body.name
            const imageUrl = req.file.filename
            console.log(imageUrl);
            const category = await categoryModel.findOneAndUpdate({_id:req.params.id},{$set:{name:newname,imageUrl:imageUrl}},{new:true})
            console.log("test");
            console.log(category);
            res.redirect('/admin/categoriesandbrands')
        }
        else{
            const newname = req.body.name
            const cat = await categoryModel.find({_id:req.params.id})
            const imageUrl = cat.imageUrl
            console.log(imageUrl);
            const category = await categoryModel.findOneAndUpdate({_id:req.params.id},{$set:{name:newname}})
            console.log(category);
            res.redirect('/admin/categoriesandbrands')
        }
    }catch(error) {
        console.log(error);
    }
}

const getadminaddproduct = async(req,res) => {
    try{
        const category = await categoryModel.find({})
        const brand = await brandModel.find({})
        res.render("admin/adminaddproduct",{category,brand})
        
    }catch(error){
        console.log(error);
    }
}

const postadminaddproduct = async(req,res) =>{
    try{
        // console.log(req.body);
        // console.log(req.files);
        req.body.Status = 'Active'
        req.body.Display = 'Active'
        images = []
        // console.log(req.files);

        for (let i = 1; i <= 3; i++) {
            const fieldName = `image${i}`;
            if (req.files[fieldName] && req.files[fieldName][0]) {
              images.push(req.files[fieldName][0].filename);
            }
          }
          req.body.imageUrl = images
        // console.log(req.body.imageUrl)
          
        Tags= req.body.tags.split(',')
        req.body.tags = Tags
      
        const date = new Date()
        const newdate = moment(date).format('llll')
        req.body.UpdatedOn = newdate
        const product = await productModel.create(req.body)
        // console.log(product);
        res.redirect("/admin/adminshowproduct")
    }catch(error){
        console.log(error);
    }
}

// const getadminshowproduct = async(req,res) =>{
//     try{
//         const page = parseInt(req.query.page) || 1; // Get the page number from query parameters
//             const perPage = 10; // Number of items per page
//             const skip = (page - 1) * perPage;

//             // Query the database for products, skip and limit based on the pagination
//             const order = await Order.find()
//                 .skip(skip)
//                 .limit(perPage).lean();
//         const product = await productModel.find({})
//         res.render('admin/adminshowproduct',{product,currentPage:1,perPage:10,totalCount:100,totalPages:10})
//     }catch(error){
//         console.log(error);
//     }
// }

const getadminshowproduct = async (req, res) => {
    const searchQuery = req.query.search || '';
    const page = parseInt(req.query.page) || 1; // Get the page number from query parameters
    const perPage = 10; // Number of items per page

    try{
        const filter={};
        if(searchQuery){
            filter.ProductName = { $regex: new RegExp(searchQuery,'i')}
        }
        console.log(filter);
        
  
     
      // Query the database for products, skip and limit based on the pagination
      const skip = (page - 1) * perPage;
         // Query the database for products
      const productCount = await productModel.countDocuments({}); // Count the total number of products
      const totalPages = Math.ceil(productCount / perPage); // Calculate the total number of pages
  

      const product = await productModel.find(filter)
        .skip(skip)
        .limit(perPage)
        .lean();
       

      res.render('admin/adminshowproduct', {
        product,
        currentPage: page,
        perPage,
        totalCount: productCount,
        totalPages,
      });

      console.log('Product Count:', productCount);
console.log('Total Pages:', totalPages);
console.log('Products:', product);
    } catch (error) {
      console.log(error);
    }
  };

  const geteditproduct = async(req,res) => {
    try{
        const product = await productModel.findById(req.params.id)
        const categoryid = await productModel.find({_id:req.params.id}).populate('category')
        
        
        // const category = await categoryModel.find({_id:categoryid[0].category})
        const category = await categoryModel.find()
        // const brands = await brandModel.find({_id:categoryid[0].BrandName})
        const brands = await brandModel.find()


        // console.log(category);
        // console.log(product);
        res.render('admin/editproduct',{product,brands,category})
    }catch(error){
        console.log(error);
    }
  }

  
const posteditproduct = async (req, res) => {
    try {
        if(req.files.image1 && req.files.image2 && req.files.image3){
        const category = await categoryModel.findOne({name:req.body.Category})
        const brand = await brandModel.find({name:req.body.BrandName})
        // console.log(category)
        // console.log(brand);;
        const categoryId = category._id
        const brandId = brand._id
        // console.log(categoryId);

        // console.log(req.files);
        images = []
        for (let i = 1; i <= 3; i++) {
            const fieldName = `image${i}`;
            if (req.files[fieldName] && req.files[fieldName][0]) {
              images.push(req.files[fieldName][0].filename);
            }
          }
          
        delete req.body.imageUrl
        delete req.body.Category;
        delete req.body.BrandName;


        const product = await productModel.findOneAndUpdate(
            { _id: req.params.id },
            { ...req.body, category: categoryId, BrandName: brandId, imageUrl: images },
            { new: true }
        );


        res.redirect('/admin/adminshowproduct')
        }
        else {
            const category = await categoryModel.findOne({name:req.body.Category})
            const brand = await brandModel.findOne({name:req.body.BrandName})
            const product = await productModel.findOne({_id:req.params.id})
            console.log(product,'dfghj')
            const imageUrl = product.imageUrl
            console.log("karthuu");
            // req.body.imageUrl = imageUrl
            const categoryId = category._id
            const brandId = brand._id
            const Product = await productModel.findOneAndUpdate({_id:req.params.id},{...req.body,category:categoryId,BrandName:brandId,imageUrl:imageUrl},{new:true})
            res.redirect('/admin/adminshowproduct')
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

const getadminproduct = async(req,res) =>{
    try{
        console.log(req.params.id);
        const product = await productModel.findOne({_id: req.params.id})
        console.log(product);
        // console.log(product.Status);
        // console.log(product.Display);
        if(product.Display == 'Active') {
            const product = await productModel.findByIdAndUpdate({_id:req.params.id},{Display:"Inactive"})
        }else if(product.Display == 'Inactive'){
            const product = await productModel.findByIdAndUpdate({_id:req.params.id},{Display:'Active'})
        }
        console.log(product.Display);
        res.redirect('/admin/adminshowproduct')
    }catch(error){
        console.log(error);
        res.redirect('/admin/adminshowproduct')
    }
}

const getdeletecategory = async(req,res) =>{
    try{

        const categoryId = req.params.id
        // const categoryIdObjectId = mongoose.Types.ObjectId(categoryId);
        // console.log(req.params.id);
        const category = await categoryModel.findById(req.params.id)
       if(category.Status ==='Active') {
        const category = await categoryModel.findByIdAndUpdate({_id:req.params.id},{Status:'Blocked'})
       
        const product = await productModel.updateMany({category:req.params.id},{Display:'Inactive'})
    
       }else if(category.Status === 'Blocked') {
        const category = await categoryModel.findByIdAndUpdate({_id:req.params.id},{Status:'Active'})
        
        const product = await productModel.updateMany({category:req.params.id},{Display:'Active'})
       }
       console.log(category.Status);
       res.redirect('/admin/categoriesandbrands')
    }catch(error){
        console.log(error);
    }
}



module.exports={getaddcategory,postaddcategory,getcategoriesandbrands,getaddbrands,postaddbrands,geteditcategory,posteditcategory,getadminaddproduct,postadminaddproduct,
getadminshowproduct,geteditproduct,posteditproduct,getadminproduct,getdeletecategory}