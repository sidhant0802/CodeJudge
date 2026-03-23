const { Int32 } = require('mongodb');
const mongoose=require('mongoose');
const TestSchema=new mongoose.Schema({
    TestcaseName:{
        type:String,
        default:null,
        required:true,
    },
    Input:{
        type:String,
        required:true,
        default:null,
    },
    Solution:{
        type:String,
        default:null,
        required:true,
        // unique:true,
    },
});
module.exports=mongoose.model("TestCases",TestSchema);