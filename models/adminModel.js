const mongoose = require('mongoose');

const adminLogin = mongoose.Schema({
    username : {
        type : String,
        require : true
    },
    password : {
        type : String,
        require : true
    },
    adminname : {
        type : String,
        require : true
    }

});

const addCategory = mongoose.Schema({
    categoryname : {
        type : String,
        require : true
    },
    description : {
        type : String,
        require : true
    },
    list : {
        type : Boolean,
        default : true
    },
    delete : {
        type : Boolean,
        default : false
    },
    deletedate : {
        type : Date
    }
})

const productData = mongoose.Schema({
    productName : {
        type : String,
        require : true
    },
    categorys : {
        type : [String],
        require : true
    },
    description : {
        type : String,
        require : true
    },
    brandname : {
        type : String,
        require : true
    },
    stock : {
        type : Number,
        require : true
    },
    price : {
        type : Number,
        require : true
    },
    size : {
        type : String,
        require : true
    },
    material : {
        type : String,
        require : true
    },
    color : {
        type : String,
        require : true
    },
    productImages : {
        type : [String],
        require : true
    },
    specifications : {
        type : [String],
        require : true
    },
    status : {
        type : Boolean,
        default : true
    },
    rating : {
        type : String,
        default : 5
    },
    feedback : {
        type : String,
        default :'Good'
    },
    addDate : {
        type : Date,
        require : true
    },
    listDate : {
        type : Date,
        require : true
    }
});


const loginData = mongoose.model('adminlogin',adminLogin);
const category = mongoose.model('categorys',addCategory);
const productInfo = mongoose.model('products',productData);

module.exports = {
    loginData,
    category,
    productInfo
};