const bcrypt = require('bcrypt');
const {loginData,category} = require('../models/adminModel');
const {userData} = require('../models/userModal');
const { query } = require('express');


/*---------------------------------------ADMIN ROUTER ACCESSING FUNCTIONS----------------------------------------------------------*/
async function strong(pass){
    try{
        const x = await bcrypt.hash(pass,10)
    return x;
    }catch(err){
        console.log(err)
    }
    
}


/*---------------------------------------ADMIN LOGIN & HOME PAGE LOAD FUNTIONS---------------------------------------------------------*/

// VIEW Admin Login Page 
const loadAdminLogin = (req,res) =>{
    res.render('admin/login',{admin:false,style:true});

}

// Verify the Admin Credential and Redirect Admin Homepage
const verifyLogin = async(req,res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;
        const adminData = await loginData.findOne({username:username});
        if(adminData){
            const passwordMatch = await bcrypt.compare(password,adminData.password)
            if(passwordMatch){
                req.session.name = adminData.adminname;
                req.session.admin_id = adminData._id;
                res.redirect('admin/home');
            }else{
                res.send("Invalid Data");
            }
        }
    }catch(error){
        console.log(error.message);
    }
    
}

// VIEW Admin Home Window 
const loadAdminHomepage = (req,res) => {
    // const name = req.params.adminData.name;
    res.render('admin/main',{admin:true,name:req.session.name,title:'AdminHome'});
}



/*---------------------------------------ADMIN USER MANAGE ROUTE FUNCTIONS---------------------------------------------------------*/

// VIEW User List Window
const loadUserList = async(req,res) => {
    const user = await userData.find({});
    console.log(user)
    res.render('admin/viewUsers',{admin:true,title:'userlist',data:user});
}

// Load Product List Window
const loadProductList = (req,res) => {
    res.render('admin/viewProducts',{admin:true});

}

// Load Add Product page 
const loadAddProductPage = (req,res) => {
    res.render('admin/addProduct',{admin:true});
}

// Load Edit Product page 
const loadEditProductPage = (req,res) => {
    res.render('admin/editProduct',{admin:true});
}



/*----------------------------------------- CATEGORY SECTION-----------------------------------------------------------*/

//View Categorys 
const loadCategoryList = async(req,res) => {
    try{

        const categoryData = await category.find({}).sort({list:-1});
        res.render('admin/viewCategorys',{admin:true,data:categoryData,title:'Categorylist'}); 

    }catch(error){

        console.log(error.message);

    }
}

// Searching Category Using Category Name
const searchCategory = async(req,res) => {

    const search = req.body.search;
    const regex = new RegExp(`^${search}.*`, 'i');
    const searchData = await category.find({categoryname:{$regex:regex}});
    res.render('admin/viewCategorys',{admin:true,data:searchData,title:'Categorylist'});    

}

// List/Unlist The Category Functionality and Change the CAtegoroy field "list" then Provide a message
const categorySatusUpdate = async(req,res) => {

    try{
        const name = req.body.category;
        const categoryData = await category.findOne({categoryname:name});

        // in this case checking the category Unlisted or not
        if(categoryData.list){

            const storeData = await category.findOneAndUpdate(
                {categoryname:name},
                {$set:{list:false,listedDate:new Date()}},
                {new:true});

            // Store Data and send result
            if(storeData){
    
                res.json({'list':false});  

            }else{
                res.status(500).render('partials/error-500')
            }

        }else{

            const storeData = await category.findOneAndUpdate(
                {categoryname:name},
                {$set:{list:true,listedDate:new Date()}},
                {new:true});
            if(storeData){

                res.json({'list':true});
                
            }else{

                res.status(500).render('partials/error-500')
            }
        }
    }catch(error){

        console.log(error.message);

    }
}


// View the Add Category Page
const loadAddCategoryPage = (req,res) => {
    res.render('admin/addCategory',{admin:true,title:'AddCategory'});
}


// Add Category Page to Retrive Data And Store to The Database and provide the message
const addCategory = async(req,res) => {

    try{
        const name = req.body.categoryname;
        const description = req.body.description;

        // Checking name & description is present
        if(name && description){

            const checkData = await category.findOne({categoryname:{ $regex: new RegExp(`^${name}`, 'i') }});

            // Checking edit Category name is present in the Category database
            if(!checkData){

                const categoryData = category({
                    categoryname : name,
                    description : description
                });

                const dataSend = await categoryData.save();

                if(dataSend){

                    res.json({'message':'Category Sucessfullly Added','status':true});

                }else{

                    res.json({'message':'Category is not added try again'});

                }
                
            }else{

                res.json({'message':'Category is Already Exist'});
            }
        }else{

            res.json({'message':'Please Enter the Category and Description'});

        }
    }catch(error){

        console.log(error.message);
    } 
}

// View the Edit Page and Load the Details
const loadEditCategoryPage = async(req,res) => {

    const name = req.params.id;
    const categoryData = await category.findOne({categoryname:name});
    res.render('admin/editCategory',{admin:true,data:categoryData});

}


// Update the Category Values
const editCategory = async(req,res) => {

    try{
        const name = req.body.categoryname;
        const description = req.body.description;
        const id = req.body.categoryId;
        if(name && description){
           
            const dataCheck =await category.findOne({categoryname:name});

            if(dataCheck){

                res.json({'message':'Category is Already Exist'});

            }else{

                const dataSend = await category.updateOne({_id:id},{$set:{categoryname:name,description:description}});

                if(dataSend){
                    res.json({'message':'Category Sucessfullly Added','status':true});
                }else{
                    res.json({'message':'Category is not Updated try again'});
                }
            }
        }else{
            res.json({'message':'Please Enter the Category and Description'});
        }
        
    }catch(error){
        console.log(error.message);
    } 
}

// Load Add Banner page 
const loadAddBannerPage = (req,res) => {
    res.render('admin/addBanner',{admin:true});
}

// Load  Coupon List Window
const loadCouponList = (req,res) => {
    res.render('admin/viewCoupons',{admin:true});
}

// Load Add Coupon page 
const loadAddCouponPage = (req,res) => {
    res.render('admin/addCoupon',{admin:true});
}


// Load  Order List Window
const loadOrderList = (req,res) => {
    res.render('admin/viewOrders',{admin:true})
}



const logoutAdmin = (req,res) => {
    try{
        req.session.destroy((error) => {
            if(error){
                console.error(message.error);
            }else{
                res.redirect('/admin/');
            }
        })
    }catch(error){
        console.error(error.message);
    }
    
}


// ERROR Page Loading 
const load500ErrorPage = (req,res) =>{
    res.render('partials/error-500',{link:'/admin'})
}

const load404ErrorPage = (req,res) =>{
    res.render('partials/error-404',{link:'/admin'})
}

module.exports = {
    loadAdminLogin,
    verifyLogin,
    loadAdminHomepage ,
    loadUserList,
    loadProductList,
    loadAddProductPage,
    loadEditProductPage,
    loadCategoryList,
    searchCategory,
    categorySatusUpdate,
    loadAddCategoryPage,
    loadEditCategoryPage,
    editCategory,
    loadAddBannerPage,
    loadCouponList,
    loadAddCouponPage,
    loadOrderList,
    logoutAdmin,
    addCategory,
    load500ErrorPage,
    load404ErrorPage
}