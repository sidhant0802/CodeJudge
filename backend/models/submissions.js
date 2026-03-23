const mongoose=require('mongoose');
const SubmissionSchema=new mongoose.Schema({
    // SID:{
    //     type:Number,
    //     default:null,
    //     required:true,
    //     unique:true,
    // },
    code:{
        type:String,
        default:null,
        required:true,
    },
    DateTime:{
        type:Date,
        default:Date.now,
        required:true,
    },
    userhandle:{
        type:String,
        default:null,
        required:true,
        // unique:true,
    },
    PID:{
        type:String,
        required:true,
        default:null,
        // unique:true,
    },
    ProblemName:{
        type:String,
        required:true,
        default:null,
        // unique:true,
    },
    language:{
        type:String,
        default:null,
        required:true,
    },
    Status:{
        type:String,
        default:null,
        required:true,
    },
    Time:{
        type:Number,
        default:0,
        required:true,
    },
    Memory:{
        type:Number,
        default:0,
        required:true,
    }
});
module.exports=mongoose.model("Submissions",SubmissionSchema);