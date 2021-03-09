var express = require('express');
var router = express.Router();
var cors = require("cors");
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var mongoose = require('mongoose');
require("dotenv");
// const fs = require('fs');
// const Path = require('path');
const Axios = require('axios');
// var multer = require('multer');
// const isEmpty = require('lodash.isempty');
var moment = require('moment');
var usermodel = require("../model/usermodel");
var servicemodel = require("../model/servicemodel");
const gallerymodel = require('../model/gallerymodel');
const offerschema = require("../model/offermodel");
const { Mongoose } = require('mongoose');
const { exit } = require('process');
var vCardsJS = require('vcards-js');

var userimage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/user");
    },
    filename: function(req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

var Userimg = multer({ storage: userimage });

// const PlaylistSummary = require('youtube-playlist-summary')
// const config = {
//   GOOGLE_API_KEY: 'YOUR_GOOGLE_API_KEY', // require
//   PLAYLIST_ITEM_KEY: ['publishedAt', 'title', 'description', 'videoId', 'videoUrl'], // option
// }
 
// const ps = new PlaylistSummary(config)
// const CHANNEL_ID = 'UCQCaS3atWyNHEy5PkDXdpNg'
// const PLAY_LIST_ID = 'PL9f8_QifuTL4CS8-OyA-4WADhkddOnRS4'
 
// ps.getPlaylistItems(PLAY_LIST_ID)
//   .then((result) => {
//     console.log(result)
//   })
//   .catch((error) => {
//     console.error(error)
//   })
 
// ps.getPlaylists(CHANNEL_ID)
//   .then((result) => {
//     console.log(result)
//   })
//   .catch((error) => {
//     console.error(error)
//   })
 
// ps.getSummary(CHANNEL_ID)
//   .then((result) => {
//     console.log(result)
//   })
//   .catch((error) => {
//     console.error(error)
//   })

router.post("/checkDigitalCardMember", Userimg.fields([
    { name: 'imagecode' }, 
    { name: 'coverimg' },
    { name: 'digiCardLogo' },
]), async function(req, res, next) {
    // const { name, mobile, company_name,email,imagecode,referalcode,myreferalcode} = req.body;
    const {
        name,
        email,
        mobile,
        website,
        company_name,
        whatsapp,
        faceBook,
        instagram,
        linkedIn,
        twitter,
        youTube,
        company_website,
        company_mobile,
        company_address,
        company_email,
        imagecode,
        panNo,
        googlePage,
        about,
        role,
        coverimg,
        gstNo,
        mapLocation,
        about_company,
        shareMsg,
    } = req.body;

    let user_img = [];
    let cover_img = [];
    let fileimg = req.files.imagecode;
    let filecover = req.files.coverimg;
    let digiCardLogoIs = req.files.digiCardLogo;
    let userLogoPath;

    try {
        let isData = await usermodel.find({ mobile: req.body.mobile });
        if (isData.length == 1) {
            res.status(200).json({ IsSuccess: true, Data: isData, Message: "User logged in successfully" });
        } else {
            if (req.files) {
                const cloudinary = require('cloudinary').v2;
                cloudinary.config({
                    cloud_name: 'dc6ouyypu',
                    api_key: '296773621645811',
                    api_secret: 'yrCG_ZiUgIUIvXU782fAeCv2L_g'
                });

                if(digiCardLogoIs){
                    let uniqimg = "";
                    uniqimg = moment().format('MMMM Do YYYY, h:mm:ss a');
                    let v = await cloudinary.uploader.upload(digiCardLogoIs[0].path, { public_id: `vcard/user/${uniqimg}`, tags: `vcard` }, function(err, result) {
                        // console.log("Error : ", err);
                        // console.log("Resilt : ", result);
                        userLogoPath = result.url;
                    });
                    // return res.send(userLogoPath);
                }

                if (req.files.imagecode) {
                    let uniqimg = "";
                    uniqimg = moment().format('MMMM Do YYYY, h:mm:ss a');
                    let v = await cloudinary.uploader.upload(fileimg[0].path, { public_id: `vcard/user/${uniqimg}`, tags: `vcard` }, function(err, result) {
                        // console.log("Error : ", err);
                        // console.log("Resilt : ", result);
                        user_img[0] = result.url;
                    });
                }

                if (req.files.coverimg) {
                    let uniqimg = "";
                    uniqimg = moment().format('MMMM Do YYYY, h:mm:ss a');
                    let v = await cloudinary.uploader.upload(filecover[0].path, { public_id: `vcard/user/${uniqimg}`, tags: `vcard` }, function(err, result) {
                        // console.log("Error : ", err);
                        // console.log("Resilt : ", result);
                        cover_img[0] = result.url;
                    });
                }
            }
            let updateuser = await new usermodel({
                name: name != undefined ? name : isData[0].name,
                mobile: mobile != undefined ? mobile : isData[0].mobile,
                email: email != undefined ? email : isData[0].email,
                whatsapp: whatsapp != undefined ? whatsapp : isData[0].whatsapp,
                panNo: panNo != undefined ? panNo : isData[0].panNo,
                website: website != undefined ? website : isData[0].website,
                faceBook: faceBook != undefined ? faceBook : isData[0].faceBook,
                instagram: instagram != undefined ? instagram : isData[0].instagram,
                youTube: youTube != undefined ? youTube : isData[0].youTube,
                linkedIn: linkedIn != undefined ? linkedIn : isData[0].linkedIn,
                twitter: twitter != undefined ? twitter : isData[0].twitter,
                googlePage: googlePage != undefined ? googlePage : isData[0].googlePage,
                about: about != undefined ? about : isData[0].about,
                about_company: about_company != undefined ? about_company : isData[0].about_company,
                role: role != undefined ? role : isData[0].role,
                gstNo: gstNo != undefined ? gstNo : isData[0].gstNo,
                mapLocation: mapLocation != undefined ? mapLocation : isData[0].mapLocation,
                shareMsg: shareMsg != undefined ? shareMsg : isData[0].shareMsg,
                company_name: company_name != undefined ? company_name : isData[0].company_name,
                company_website: company_website != undefined ? company_website : isData[0].company_website,
                company_address: company_address != undefined ? company_address : isData[0].company_address,
                company_email: company_email != undefined ? company_email : isData[0].company_email,
                company_mobile: company_mobile != undefined ? company_mobile : isData[0].company_mobile,
                imagecode: imagecode != undefined || null ? user_img[0] : "https://res.cloudinary.com/dc6ouyypu/image/upload/v1614057054/vcard/user/user-profile_nxo5gq.png",
                coverimg: coverimg != undefined || null ? cover_img[0] : "https://res.cloudinary.com/dc6ouyypu/image/upload/v1614056361/vcard/user/The-National-Dawn_scxuio.jpg",
                digiCardLogo: digiCardLogoIs != undefined || null ? userLogoPath : "https://res.cloudinary.com/dc6ouyypu/image/upload/v1614057054/vcard/user/user-profile_nxo5gq.png",
                referalcode: req.body.referalcode == undefined ? "" : req.body.referalcode,
                myreferalcode: req.body.myreferalcode == undefined ? "" : req.body.myreferalcode,
            });
            if (updateuser) {
                updateuser.save();
                res.status(200).json({ IsSuccess: true, Data: [updateuser], Message: "User Created" });
            } else {
                res.status(200).json({ IsSuccess: true, Data: [], Message: "User not Created" });
            }
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post("/login", async function(req, res, next) {
    const mobile = req.body.mobile;
    try {
        let isuser = await usermodel.find({ mobile: mobile });
        if (isuser.length != 0) {
            res.status(200).json({ IsSuccess: true, Data: [isuser], Message: "User logged in successfully" });
        } else {
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Enter proper credentials" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post("/addservice",Userimg.single('serviceimg'), async function(req, res, next) {
    const { title, memberid, description,serviceimg } = req.body;
    let offerimg;
    let fileimg = req.file;
    let ser_img=[];
    try {
        if(req.file){
            const cloudinary = require('cloudinary').v2;
            cloudinary.config({
                cloud_name: 'dc6ouyypu',
                api_key: '296773621645811',
                api_secret: 'yrCG_ZiUgIUIvXU782fAeCv2L_g'
            });

            offerimg = "";
            offerimg = moment().format('MMMM Do YYYY, h:mm:ss a');
            let v = await cloudinary.uploader.upload(fileimg.path, { public_id: `vcard/offer/${offerimg}`, tags: `vcard` }, function(err, result) {
                ser_img[0] = result.url;
            });
        }
        let newservice = await new servicemodel({
            title: title,
            description: description,
            memberId: memberid,
            serviceimg : req.file != undefined ? ser_img[0] : "",
        });
        if (newservice) {
            newservice.save();
            res.status(200).json({ IsSuccess: true, Data: [newservice], Message: "New service added" });
        } else {
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Service not added" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post("/addimages", Userimg.fields([{ name: 'images' }, { name: 'videos' }]), async function(req, res, next) {
    const { memberid, images, videos } = req.body;
    let g_image = [];
    let g_video = [];
    console.log(req.body);
    let fileinfo = req.files.images;
    let filevideo = req.files.videos;
    console.log(fileinfo);
    console.log(filevideo);
    try {
        let isuser = await usermodel.findById(memberid);
        if (isuser) {
            if (req.files.images || req.files.videos) {
                const cloudinary = require('cloudinary').v2;
                cloudinary.config({
                    cloud_name: 'dc6ouyypu',
                    api_key: '296773621645811',
                    api_secret: 'yrCG_ZiUgIUIvXU782fAeCv2L_g'
                });

                if (req.files.images) {
                    for (let j = 0; j < fileinfo.length; j++) {
                        let uniqname = "";
                        uniqname = moment().format('MMMM Do YYYY,h:mm:ss a');
                        let c = await cloudinary.uploader.upload(fileinfo[j].path, { public_id: `vcard/user/${uniqname}`, tags: `vcard` }, function(err, result) {
                            // console.log("Error : ", err);
                            // console.log("Resilt : ", result);
                            g_image[j] = result.url;
                        });
                    }
                }

                if (req.files.videos) {
                    for (let j = 0; j < filevideo.length; j++) {
                        let uniqvideo = "";
                        uniqvideo = moment().format('MMMM Do YYYY,h:mm:ss a');
                        let c = await cloudinary.uploader.upload(fileinfo[j].path, { resource_type: "video", public_id: `vcard/user/${uniqvideo}`, tags: `vcard` }, function(err, result) {
                            // console.log("Error : ", err);
                            // console.log("Resilt : ", result);
                            g_video[j] = result.url;
                        });
                    }
                }
                // if(req.files.videos){
                //     let uniqvideo = "";
                //     uniqvideo = moment().format('MMMM Do YYYY,h:mm:ss a');
                //     let v = await cloudinary.uploader.upload(filevideo[0].path, {resource_type:"video", public_id: `vcard/user/${uniqvideo}`, tags: `blog` },function(err,result) {
                //     // console.log("Error : ", err);
                //     // console.log("Resilt : ", result);
                //     g_video[0] = result.url;
                //     });
                // }

                let galleryupload = await new gallerymodel({
                    memberId: memberid,
                    images: g_image,
                    videos: g_video
                });
                if (galleryupload) {
                    galleryupload.save();
                    res.status(200).json({ IsSuccess: true, Data: [galleryupload], Message: "Uploaded successfully" });
                } else {
                    res.status(200).json({ IsSucecss: true, Data: [], Message: "Not uploaded successfully" });
                }
            }
        } else {
            res.send("enter proper details");
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post("/getsingleuserdata", async function(req, res, next) {
    const { userid } = req.body;
    try {
        let isUser = await usermodel.aggregate([{
                $match: {
                    _id: mongoose.Types.ObjectId(userid),
                },
            },
            {
                $lookup: {
                    from: "galleries",
                    localField: "_id",
                    foreignField: "memberId",
                    as: "gallery"
                }
            },
            {
                $lookup: {
                    from: "services",
                    localField: "_id",
                    foreignField: "memberId",
                    as: "services"
                }
            },
        ]);
        if (isUser) {
            res.status(200).json({ IsSuccess: true, Data: isUser, Message: "User data found" });
        } else {
            res.status(200).json({ IsSuccess: true, Data: [], Message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post("/updateprofile",Userimg.fields([
    { name: 'imagecode' }, 
    { name: 'coverimg' },
    { name: 'digiCardLogo' },
]), async function(req,res,next){
    const {
        memberid,
        name,
        email,
        mobile,
        website,
        company_name,
        whatsapp,
        faceBook,
        instagram,
        linkedIn,
        twitter,
        youTube,
        company_website,
        company_mobile,
        company_address,
        company_email,
        imagecode,
        panNo,
        googlePage,
        about,
        role,
        gstNo,
        mapLocation,
        about_company,
        shareMsg,
        coverimg
    } = req.body; 

    let user_img=[];
    let cover_img =[];
    const fileimg = req.files.imagecode;
    const filecover = req.files.coverimg;
    let digiCardLogoIs = req.files.digiCardLogo;
    let userLogoPath;
    
    if(req.files){
        console.log("1");
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
            cloud_name: 'dc6ouyypu',
            api_key: '296773621645811',
            api_secret: 'yrCG_ZiUgIUIvXU782fAeCv2L_g'
        });

        if(digiCardLogoIs){
            let uniqimg = "";
            uniqimg = moment().format('MMMM Do YYYY, h:mm:ss a');
            let v = await cloudinary.uploader.upload(digiCardLogoIs[0].path, { public_id: `vcard/user/${uniqimg}`, tags: `vcard` }, function(err, result) {
                // console.log("Error : ", err);
                // console.log("Resilt : ", result);
                userLogoPath = result.url;
            });
            // return res.send(userLogoPath);
        }

        if (req.files.imagecode){
        console.log("2");
            let uniqimg = "";
            uniqimg = moment().format('MMMM Do YYYY, h:mm:ss a');
            let v = await cloudinary.uploader.upload(fileimg[0].path, { public_id: `vcard/user/${uniqimg}`, tags: `vcard` }, function(err, result) {
                // console.log("Error : ", err);
                // console.log("Resilt : ", result);
                user_img[0] = result.url;
            });
        }

        if (req.files.coverimg){
        console.log("3");
            let uniqimg = "";
            uniqimg = moment().format('MMMM Do YYYY, h:mm:ss a');
            let v = await cloudinary.uploader.upload(filecover[0].path, { public_id: `vcard/user/${uniqimg}`, tags: `vcard` }, function(err, result) {
                // console.log("Error : ", err);
                // console.log("Resilt : ", result);
                cover_img[0] = result.url;
            });
        }
    }
    try {
        let isuser = await usermodel.aggregate([{
            $match: {
                _id: mongoose.Types.ObjectId(memberid),
            }
        }]);
        if(isuser.length == 1){
            let updateuser = {
                name: name != undefined ? name : isuser[0].name,
                mobile: mobile != undefined ? mobile : isuser[0].mobile,
                email: email != undefined ? email : isuser[0].email,
                whatsapp: whatsapp != undefined ? whatsapp : isuser[0].whatsapp,
                panNo: panNo != undefined ? panNo : isuser[0].panNo,
                website: website != undefined ? website : isuser[0].website,
                faceBook: faceBook != undefined ? faceBook : isuser[0].faceBook,
                instagram: instagram != undefined ? instagram : isuser[0].instagram,
                youTube: youTube != undefined ? youTube : isuser[0].youTube,
                linkedIn: linkedIn != undefined ? linkedIn : isuser[0].linkedIn,
                twitter: twitter != undefined ? twitter : isuser[0].twitter,
                googlePage: googlePage != undefined ? googlePage : isuser[0].googlePage,
                about: about != undefined ? about : isuser[0].about,
                about_company: about_company != undefined ? about_company : isuser[0].about_company,
                role: role != undefined ? role : isuser[0].role,
                gstNo: gstNo != undefined ? gstNo : isuser[0].gstNo,
                mapLocation: mapLocation != undefined ? mapLocation : isuser[0].mapLocation,
                shareMsg: shareMsg != undefined ? shareMsg : isuser[0].shareMsg,
                company_name: company_name != undefined ? company_name : isuser[0].company_name,
                company_website: company_website != undefined ? company_website : isuser[0].company_website,
                company_address: company_address != undefined ? company_address : isuser[0].company_address,
                company_email: company_email != undefined ? company_email : isuser[0].company_email,
                company_mobile: company_mobile != undefined ? company_mobile : isuser[0].company_mobile,
                imagecode: req.files.imagecode != undefined ? user_img[0] : isuser[0].imagecode,
                coverimg: req.files.coverimg != undefined ? cover_img[0] : isuser[0].coverimg,
                digiCardLogo: digiCardLogoIs != undefined || null ? userLogoPath : "https://res.cloudinary.com/dc6ouyypu/image/upload/v1614057054/vcard/user/user-profile_nxo5gq.png"
            };
            let updateprofile = await usermodel.findByIdAndUpdate(memberid,updateuser);
            if(updateprofile){
                let findupdated = await usermodel.findById(memberid);
                res.status(200).json({ IsSuccess : true, Data:[findupdated], Message : "User Updated"});
            }
            else{
                res.status(200).json({ IsSuccess : true, Data:[], Message : "User not updated"});
            }
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

// router.post("/updateprofile_old", Userimg.fields([{ name: 'imagecode' }, { name: 'coverimg' }]), async function(req, res, next) {
//     const {
//         memberid,
//         name,
//         email,
//         mobile,
//         website,
//         company_name,
//         whatsapp,
//         faceBook,
//         instagram,
//         linkedIn,
//         twitter,
//         youTube,
//         company_website,
//         company_mobile,
//         company_address,
//         company_email,
//         imagecode,
//         panNo,
//         googlePage,
//         about,
//         role,
//         gstNo,
//         mapLocation,
//         about_company,
//         shareMsg,
//         coverimg
//     } = req.body;

//     let user_img = [];
//     let cover_img = [];
//     let fileimg;
//     let filecover;

//     if (req.files) {
//         console.log("1");
//         fileimg = req.files.imagecode;
//         console.log(fileimg);
//         filecover = req.files.coverimg;
//         console.log(filecover);
//     } else {
//         console.log("2");
//         fileimg = null;
//         filecover = null;
//     }
//     try {
//         let isuser = await usermodel.aggregate([{
//             $match: {
//                 _id: mongoose.Types.ObjectId(memberid),
//             }
//         }]);
//         console.log(isuser);
//         console.log(isuser[0]._id);

//         if (isuser) {
//             if (req.files) {
//                 console.log("1");
//                 const cloudinary = require('cloudinary').v2;
//                 cloudinary.config({
//                     cloud_name: 'dc6ouyypu',
//                     api_key: '296773621645811',
//                     api_secret: 'yrCG_ZiUgIUIvXU782fAeCv2L_g'
//                 });

//                 if (req.files.imagecode){
//                     let uniqimg = "";
//                     uniqimg = moment().format('MMMM Do YYYY, h:mm:ss a');
//                     let v = await cloudinary.uploader.upload(fileimg[0].path, { public_id: `vcard/user/${uniqimg}`, tags: `vcard` }, function(err, result) {
//                         console.log("Error : ", err);
//                         console.log("Resilt : ", result);
//                         user_img[0] = result.url;
//                     });
//                 }

//                 if (req.files.coverimg){
//                     let uniqimg = "";
//                     uniqimg = moment().format('MMMM Do YYYY, h:mm:ss a');
//                     let v = await cloudinary.uploader.upload(filecover[0].path, { public_id: `vcard/user/${uniqimg}`, tags: `vcard` }, function(err, result) {
//                         cover_img[0] = result.url;
//                     });
//                 }

//                 let updateuser = {
//                     name: name,
//                     mobile: mobile,
//                     email: email,
//                     whatsapp: whatsapp,
//                     panNo: panNo,
//                     website: website,
//                     faceBook: faceBook,
//                     instagram: instagram,
//                     youTube: youTube,
//                     linkedIn: linkedIn,
//                     twitter: twitter,
//                     googlePage: googlePage,
//                     about: about,
//                     about_company: about_company,
//                     role: role,
//                     gstNo: gstNo,
//                     mapLocation: mapLocation,
//                     shareMsg: shareMsg,
//                     company_name: company_name,
//                     company_website: company_website,
//                     company_address: company_address,
//                     company_email: company_email,
//                     company_mobile: company_mobile,
//                     imagecode: user_img[0],
//                     coverimg: cover_img[0],
//                 };
//                 let updateprofile = await usermodel.findByIdAndUpdate(isuser._id, updateuser);
//                 if (updateprofile) {
//                     res.status(200).json({ IsSuccess: true, Data: [updateuser], Message: "User updated" });
//                 } else {
//                     res.status(200).json({ IsSuccess: true, Data: [], Message: "User not updated" });
//                 }
//             } else {
//                 console.log("2");
//                 let updateuser = {
//                     name: name,
//                     mobile: mobile,
//                     email: email,
//                     whatsapp: whatsapp,
//                     panNo: panNo,
//                     website: website,
//                     faceBook: faceBook,
//                     instagram: instagram,
//                     youTube: youTube,
//                     linkedIn: linkedIn,
//                     twitter: twitter,
//                     googlePage: googlePage,
//                     about: about,
//                     about_company: about_company,
//                     role: role,
//                     gstNo: gstNo,
//                     mapLocation: mapLocation,
//                     shareMsg: shareMsg,
//                     company_name: company_name,
//                     company_website: company_website,
//                     company_address: company_address,
//                     company_email: company_email,
//                     company_mobile: company_mobile,
//                 }
//                 let updateprofile = await usermodel.findByIdAndUpdate(isuser[0]._id, updateuser);
//                 if (updateprofile) {
//                     res.status(200).json({ IsSucess: true, Data: [updateuser], Message: "User updated" });
//                 } else {
//                     res.status(200).json({ IsSucess: true, Data: [], Message: "User not updated" });
//                 }
//             }
//         }

//     } catch (error) {
//         res.status(500).json({ IsSuccess: false, Message: error.message });
//     }
// });

router.post("/addoffer", Userimg.single('imagecode'), async function(req, res, next) {
    const { memberId, title, description, imagecode, validtilldate } = req.body;
    let fileimg = req.file;

    let off_img = [];
    try {
        let userIs = await usermodel.find({ _id: memberId });
        console.log(userIs);
        if (userIs) {
            if (req.file) {
                console.log("1");
                const cloudinary = require('cloudinary').v2;
                cloudinary.config({
                    cloud_name: 'dc6ouyypu',
                    api_key: '296773621645811',
                    api_secret: 'yrCG_ZiUgIUIvXU782fAeCv2L_g'
                });

                offerimg = "";
                offerimg = moment().format('MMMM Do YYYY, h:mm:ss a');
                let v = await cloudinary.uploader.upload(fileimg.path, { public_id: `vcard/offer/${offerimg}`, tags: `vcard` }, function(err, result) {
                    off_img[0] = result.url;
                });

                let offerdata = await new offerschema({
                    memberId: memberId,
                    title: title,
                    description: description,
                    imagecode: off_img[0],
                    validtilldate: validtilldate,
                })
                if (offerdata) {
                    offerdata.save();
                    res.status(200).json({ IsSuccess: true, Data: [offerdata], Message: "Offer added" });
                } else {
                    res.status(200).json({ IsSuccess: true, Data: [], Message: "Offer not added" });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post("/getuseroffer", async function(req, res, next) {
    const userid = req.body.userid;
    try {
        let findoffer = await offerschema.find({ memberId: userid });
        if (findoffer.length > 0) {
            res.status(200).json({ IsSuccess: true, Data: findoffer, Message: "All service Found" });
        } else {
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Service Not Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post("/updateoffer", Userimg.single('imagecode'), async function(req, res, next) {
    const { offerId, title, description, validtilldate, imagecode } = req.body;
    // let fileimg = req.file;
    let off_img = [];
    try {
        let findoffer = await offerschema.findById(offerId);
        if (findoffer) {
            if (req.file) {
                const cloudinary = require('cloudinary').v2;
                cloudinary.config({
                    cloud_name: 'dc6ouyypu',
                    api_key: '296773621645811',
                    api_secret: 'yrCG_ZiUgIUIvXU782fAeCv2L_g'
                });

                offerimg = "";
                offerimg = moment().format('MMMM Do YYYY, h:mm:ss a');
                let v = await cloudinary.uploader.upload(req.file.path, { public_id: `vcard/offer/${offerimg}`, tags: `vcard` }, function(err, result) {
                    off_img[0] = result.url;
                });

                let updatedataimg = {
                    title: title,
                    description: description,
                    validtilldate: validtilldate,
                    imagecode: off_img[0]
                }
                let updatedoffer = await offerschema.findByIdAndUpdate(offerId, updatedataimg);
                if (updatedoffer) {
                    let findupdated = await offerschema.findById(offerId);
                    res.status(200).json({ IsSuccess: true, Data: [findupdated], Message: "Offer updated" });
                } else {
                    res.status(200).json({ IsSuccess: true, Data: [], Message: "Offer not updated" });
                }

            } else {
                let updatedata = {
                    title: title,
                    description: description,
                    validtilldate: validtilldate
                }
                let updatedoffer = await offerschema.findByIdAndUpdate(offerId, updatedata);
                if (updatedoffer) {
                    let findupdated = await offerschema.findById(offerId);
                    res.status(200).json({ IsSuccess: true, Data: [findupdated], Message: "Offer updated" });
                } else {
                    res.status(200).json({ IsSuccess: true, Data: [], Message: "Offer not updated" });
                }
            }
        } else {
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Offer not found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post("/deleteoffer", async function(req, res, next) {
    const offerId = req.body.offerId;
    try {
        let deloffer = await offerschema.findByIdAndDelete(offerId);
        if (deloffer) {
            res.status(200).json({ IsSuccess: true, Data: 1, Message: "Offer deleted" });
        } else {
            res.status(200).json({ IsSuccess: true, Data: 0, Message: "Offer not deleted" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post("/deleteservice", async function(req, res, next) {
    const serviceId = req.body.serviceId;
    try {
        let deloffer = await servicemodel.findByIdAndDelete(serviceId);
        if (deloffer) {
            res.status(200).json({ IsSuccess: true, Data: 1, Message: "Service deleted" });
        } else {
            res.status(200).json({ IsSuccess: true, Data: 0, Message: "Service not deleted" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post("/getuserservice", async function(req, res, next) {
    const userid = req.body.userid;
    try {
        let findservice = await servicemodel.find({ memberId: userid });
        if (findservice.length > 0) {
            res.status(200).json({ IsSuccess: true, Data: findservice, Message: "All service Found" });
        } else {
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Service Not Found" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post("/updateservice", async function(req, res, next) {
    const { serviceId, title, description } = req.body;
    try {
        let findservice = await servicemodel.findById(serviceId);
        if (findservice) {
            let updatedata = {
                title: title,
                description: description
            };
            let updatedservice = await servicemodel.findByIdAndUpdate(serviceId, updatedata);
            if (updatedservice) {
                let findupdated = await servicemodel.findById(serviceId);
                res.status(200).json({ IsSuccess: true, Data: [findupdated], Message: "Updated service" });
            } else {
                res.status(200).json({ IsSuccess: true, Data: [], Message: "Service not updated" });
            }
        } else {
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Service not updated" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post("/savevcard", async function(req, res, next) {
    const { firstName, organization, workPhone, title, url, email } = req.body;
    try {
        var vCard = vCardsJS();

        vCard.firstName = firstName;
        vCard.organization = organization;
        vCard.workPhone = workPhone;
        vCard.title = title;
        vCard.url = url;
        vCard.email = email;

        vCard.saveToFile('vcf/demo.vcf');
        // const vcfFile = '../../../demo.vcf';
        let finldata = vCard.getFormattedString();
        // console.log(vCard.getFormattedString());
        // res.download('vcf/demo.vcf');
        res.status(200).json({ IsSuccess: true, Data: finldata, Url: "http://new-digital-card.herokuapp.com/vcf/demo.vcf" });
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

// router.post("/downloadf", async function(req,res,next){
//     try{
//         const url ='vcf/demo.vcf';
//         const path = Path.resolve(__dirname,'vcf','newfile.vcf');

//         const response = Axios({
//             method : "GET",
//             url : url,
//             responseType = 'stream'
//         })
//     }
//     catch(error){
//         res.status(500).json({IsSucess : false, Message : error.message });
//     }
// });

module.exports = router;