const mongoose = require("mongoose");

const service = mongoose.Schema({
    memberId:{
        type: mongoose.Types.ObjectId, 
        ref: "User",
    },
    title :{
        type:String,
    },
    description :{
        type:String
    },
    serviceimg:{
        type:String,
        // default:"https://res.cloudinary.com/dckj2yfap/image/upload/v1614687838/blog/banner/tnd_logo_qzjrbp.png",
    }
});

module.exports = mongoose.model("Service", service);