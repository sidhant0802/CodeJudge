const mongoose=require('mongoose');
const ProblemSchema=new mongoose.Schema({
    PID:{
        type:String,
        default:null,
        required:true,
        unique:true,
    },
    ProblemName:{
        type:String,
        required:true,
        default:null,
        // unique:true,
    },
    ProblemDescription:{
        type:String,
        default:null,
        // unique:true,
    },
    ProblemLevel:{
        type:String,
        default:null,
        required:true,
    },
    TimeLimit:{
        type:Number,
        default:5,
        required:true,
    },
    Input:{
        type :String,
        default:null,
    },
    Output:{
        type:String,
        default:null,
    },
    Constraints:{
        type:String,
        default:null,
    }
});
module.exports=mongoose.model("Problems",ProblemSchema);