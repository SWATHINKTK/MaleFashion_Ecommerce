const express = require('express');
const session = require('express-session');
const moongose = require('mongoose');
const userRouter = express();

// Local Module Import 
const userController = require('../controller/userControl');
const auth = require('../middleware/userAuth');
const { compareSync } = require('bcrypt');



// Application Middleware 
userRouter.use(express.urlencoded({extended:true}));
userRouter.use(express.json())
userRouter.use(session({
    secret : 'key',
    resave : false,
    saveUninitialized : true
 }));


 
// *** CART COUNT CALCULATE USING MIDDLEWARE ****
const cartData = require('../models/cartModel');
const {userData} = require('../models/userModal');
const wishlistData = require('../models/wishlistModel')
userRouter.use(async(req,res,next) => {

    if(req.session.userId){
        const id = req.session.userId;
        const cart = await cartData.findOne({userId:id});
        const user = await userData.findOne({_id:id});
        const wishlist = await wishlistData.findOne({userId:id});
        

        res.locals.username = user ? user.username : '';
        res.locals.wishlistCount = wishlist ? wishlist.wishlistProducts.length : '';
        res.locals.cartCount =  cart ? cart.cartProducts.length : 0; 
    }
    next();
    
 })



// GET Request For User 
userRouter.get('/',userController.guestPage);
userRouter.get('/login',userController.loadUserLogin);
userRouter.get('/logout',userController.userLogout);
userRouter.get('/otpverification',userController.loadOTPVerification);
userRouter.get('/home',auth.isUserLogin,userController.loadHomePage);


userRouter.get('/allproductview',userController.loadAllProductViewPage);
userRouter.get('/categoryproductview',userController.loadSpecificCategoryProducts);
userRouter.get('/resendotp',userController.resendOTP);
userRouter.get('/productdetails',userController.loadProductDetailPage);
userRouter.get('/userprofile',auth.isUserLogin,userController.loadUserProfile);
userRouter.get('/addressinformation',auth.isUserLogin,userController.loadAddressInformation);
userRouter.get('/addnewaddress',auth.isUserLogin,userController.loadAddressForm);
userRouter.get('/editaddress:id',auth.isUserLogin,userController.loadEditAddressForm);





// DELETE REQUEST FOR USER
userRouter.delete('/deleteaddress:id',auth.isUserLogin,userController.deleteAddress);

// POST Request For User 
userRouter.post('/signup',userController.storeSignupData);
userRouter.post('/signin',userController.verifyUser);
userRouter.post('/otpverification',userController.OTPCheck);
userRouter.post('/edituserinformation',auth.isUserLogin,userController.editUserInformations);
userRouter.post('/addnewaddress',auth.isUserLogin,userController.storeAddressFormData);
userRouter.post('/updateaddress',auth.isUserLogin,userController.updateAddressData);
userRouter.post('/editPassword',auth.isUserLogin,userController.editPassword);


// USER WALLET HANDLING 
userRouter.get('/viewWallet', auth.isUserLogin, userController.loadWalletPage);
userRouter.post('/walletAmount', auth.isUserLogin, userController.addWalletAmount)


userRouter.get('/error500',userController.load500ErrorPage);
userRouter.get('/error404',userController.load404ErrorPage);  
// userRouter.get('/*',userController.load500ErrorPage);

module.exports = userRouter;