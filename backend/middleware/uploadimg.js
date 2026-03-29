const multer  = require('multer');
// const User=require('../models/User');
const fs = require("fs");
const path = require("path");
const rootDirectory = path.resolve(__dirname, "../");
const outputPath = path.join(rootDirectory, "uploads");
// console.log(outputPath);
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/')
    },
    filename:async function(req,file,cb){
        const {id:userhandle}=req.params;
        const filename=userhandle+'.jpg';
        cb(null,filename);
    }
});

const uploadimg=multer({storage:storage});
module.exports=uploadimg;