const mongoose = require("mongoose");

const user = mongoose.Schema({
    name : {
        type:String,
        require: true,
    },
    mobile :{
        type:String,
        require: true,
        unique : true,
    },
    website:{
        type:String,
        default:"",
    },
    company_name:{
        type:String,
        require: true,
    },
    email:{
        type:String,
        require: true,
    },
    whatsapp :{
        type:Number,
    },
    faceBook : {
        type: String,
        default : ""
    },
    instagram : {
        type: String,
        default : ""
    },
    linkedIn : {
        type: String,
        default: ""
    },
    twitter : {
        type: String,
        default: ""
    },
    youTube : {
        type: String,
        default: ""
    },
    panNo :{
        type: String,
        default:"",
    },
    googlePage:{
        type:String,
        default:"",
    },
    about:{
        type:String,
        default:"",
    },
    role:{
        type:String,
        default:"",
    },
    gstNo:{
        type:String,
        default:"",
    },
    mapLocation:{
        type:String,
        default:"",
    },
    about_company:{
        typr:String,
        default:"",
    },
    shareMsg:{
        type:String,
        default:"",
    },
    company_website:{
        type:String,
        default:"",
    },
    company_mobile :{
        type: String,
        default:"",   
    },
    company_address:{
        type:String,
        default:"",
    },
    company_email:{
        type:String,
        default:"",
    },
    imagecode:{
        type:String,
        default:"https://res.cloudinary.com/dc6ouyypu/image/upload/v1614057054/vcard/user/user-profile_nxo5gq.png",
    },
    referalcode:{
        type:String,
    },
    myreferalcode:{
        type:String,
    },
    coverimg:{
        type:String,
        default:"https://res.cloudinary.com/dc6ouyypu/image/upload/v1614056361/vcard/user/The-National-Dawn_scxuio.jpg",
    }
    
});

module.exports = mongoose.model("User", user);