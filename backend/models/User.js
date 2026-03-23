const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        default:null
    },
    lastName:{
        type:String,
        default:null
    },
    userhandle:{
        type:String,
        default:null,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        default:null,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type: String, 
        enum: ['user', 'admin'], 
    },
    DateTime:{
        type:Date,
        default:Date.now,
        required:true,
    },
    TotalSubmissions:{
        type:Number,
    },
    TotalAccepted:{
        type:Number,
        default:0,
    },

    Friends:{
        type:[String],
        default:[],
    }
    
});
module.exports=mongoose.model("user",userSchema);