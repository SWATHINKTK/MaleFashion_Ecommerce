const bcrypt = require('bcrypt');
const {loginData,category,productInfo} = require('../models/adminModel');
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
    res.render('admin/viewUsers',{admin:true,title:'userlist',data:user});
}

// USER BLOCK / UNBLOCK FEATURE
const blockUser = async(req,res) => {

    const id = req.body.id;
        const user = await userData.findOne({_id:id});
        console.log(user)

        // in this case checking the category Unlisted or not
        if(user.block){

            const storeData = await userData.findOneAndUpdate(
                {_id:id},
                {$set:{block:false,block_date:new Date()}},
                {new:true});

            // Store Data and send result
            if(storeData){
    
                res.json({'user':false});  

            }else{
                res.status(500).render('partials/error-500')
            }

        }else{

            const storeData = await userData.findOneAndUpdate(
                {_id:id},
                {$set:{block:true,block_date:new Date()}},
                {new:true});
            if(storeData){

                res.json({'user':true});
                
            }else{
                res.status(500).render('partials/error-500')
            }
        }
}

// User Search
const searchUser = async(req,res) => {
    const search = req.query.search;
    const regex = new RegExp(`^${search}.*`, 'i');
    const searchData = await userData.find({username:{$regex:regex}});
    // console.log(searchData)
    res.render('admin/viewUsers',{admin:true,data:searchData,title:'Users'});    
}


/*----------------------------------------- PRODUCT SECTION-----------------------------------------------------------*/


// Load Product List Window
const loadProductList = async(req,res) => {

    const product = await productInfo.find({});
    res.render('admin/viewProducts',{admin:true,data:product});

}


// Load Product More Data and view in a modal
const loadProductMoreData = async(req,res) => {
    const id = req.params.id
    console.log(id)
    const data = await productInfo.findOne({_id:id});

    if(data){
            res.status(200).render('admin/productDetailModal',{modaldata:data});

    }else{
        res.status(500).redirect('/admin/error500');
    }
}



// Product Staus Update and show list and unlist button
const productStatusUpdate = async(req,res) => {

    const id = req.params.id;
    const data = await productInfo.findOne({_id:id});
    
    if(data.status){

        const update = await productInfo.updateOne({_id:id},{$set:{status:false}});
        
        if(update.acknowledged){
            res.status(200).json({message:false,id:data._id});

        }else{
            res.redirect('/admin/error404');
        }

    }else{

        const update = await productInfo.updateOne({_id:id},{$set:{status:true,listDate:new Date()}},{upsert:true});

        if(update.acknowledged){
            res.status(200).json({message:true,id:data._id});

        }else{
            res.redirect('/admin/error404');
        }
    }
}



// Load Add Product page 
const loadAddProductPage = async(req,res) => {

    const categoryData = await category.find({list:true},{categoryname:1});
    res.render('admin/addProduct',{admin:true,data:categoryData});
}



// Adding the Product Data into Database
const productAdd = async(req,res)=>{

    // Taken Data Come Form Clent 
    const data = req.body;
    const images = [];
    console.log(req.files)
    req.files.forEach((file)=> {
        images.push(file.filename)
    });
    
    
    const length =  Object.keys(data).length;

    // checking All Field entered or not 
    if(length == 10 && images.length == 4){

        const productData = productInfo({
            productName: data.productname,
            categorys: data.categorys,
            description: data.description,
            brandname: data.brandname,
            stock: data.stock,
            price: data.price,
            size: data.size,
            material: data.material ,
            color: data.color,
            productImages: images,
            specifications: data.specification,
            addDate: new Date(),
        })

        console.log(productData)
        const product = await productData.save();

        // Sucess result Checking
        if(product){
            res.status(200).json({status:true,message:'Succesfully Added Product'});
        }else{
            res.status(500).render('/admin/error500');
        }

    }else{
        // Error message and Eror staus code
        if(length < 10){
            res.json({status:false,message:'Enter All Field'});
            
        }else{
            res.json({status:false,message:'Upload All Images'});
        }
    }

}



// Load Edit Product page 
const loadEditProductPage = async(req,res) => {

    const id = req.params.id;
    const productData = await productInfo.findOne({_id:id});

    const Data = await category.find({},{categoryname:1});
    console.log(Data)
    res.render('admin/editProduct',{admin:true,dataCategory:Data,data:productData});
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
    const regex = new RegExp(`^${search}`, 'i');
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
    searchUser,
    blockUser,
    loadProductList,
    loadProductMoreData,
    productStatusUpdate,
    loadAddProductPage,
    productAdd,
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