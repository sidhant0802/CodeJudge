const User = require('../models/User');
const Submissions=require('../models/submissions');
const bcrypt=require('bcryptjs')
const jwt=require("jsonwebtoken");
// const dotenv = require('dotenv');
const submissions = require('../models/submissions');
const allowedSortFields = ['userhandle', 'DateTime', 'firstName', 'TotalSubmissions', 'TotalAccepted'];
const allowedSortOrders = ['asc', 'desc'];
const fs = require("fs");
const path = require("path");
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
// dotenv.config();
// GET all examples
exports.a = async (req, res) => {
  res.send("Hello,world! a");
};
exports.b = async (req, res) => {
  res.send("Hello,world! b");
};
exports.register = async (req, res) => {
  
  try {
    //get all the data from the frontend
    // const {firstName,lastName,userhandle,email,password,role}=req.body;// use when to decide role admin acess
    const {firstName,lastName,userhandle,email,password}=req.body;
    const role="user";

    //check that all the data should exist
    if(!(firstName&&lastName&&userhandle&&email&&password)){
        return res.status(400).send("Please enter all the information");
    }
    
    //add more valiidations/constraints

    //check for existing userhandle and email
    const existingUser=await User.findOne({ userhandle });
    if(existingUser){
        return res.status(400).send("User already exists with the same handle");
    }
    const existingUser2=await User.findOne({ email });
    if(existingUser2){
        return res.status(400).send("User already exists with the same email");
    }
    
    //creating a hashed password
    const hashedPassword= await bcrypt.hash(password,10);

    //save the user in DB
    const user=await User.create({
        firstName,
        lastName,
        userhandle,
        email,
        password: hashedPassword,//saving hashed password for increasing security
        role,
    });
    //generate a token for the user and send it
    const token=jwt.sign({id:user._id,userhandle,role},process.env.SECRET_KEY,{
        expiresIn: '1h',
    });
    //passing the token to user
    user.token=token;
    user.password=undefined;
    //storing token in cookies with option
    const options={
        expiresIn:new Date(Date.now()+60*60*1000),
        httpOnly: true,//only manipulted by server not by your client/frontend 
        signed:true,
    }

    //send the token
    res.status(200).cookie("token",{jwtToken:token,userhandle:user.userhandle},options).json({
        message:"You have succeddfully registerd!",
        success: true,
        token,
        role:user.role,
        userhandle:user.userhandle
    });
    // res.status(200).json({message: "You have succesfully registerd!",user})
    
} 
catch (error) {
    console.log(error);
}
};
exports.read=async(req,res)=>{
    try {
        const {id:userhandle}=req.params;
        if(!userhandle){
            return res.status(400).send("Please enter handle correctlly in parametres ");
        }
        const user=await User.findOne({userhandle:userhandle});
        const currentUser = await User.findOne({ userhandle: req.signedCookies.token.userhandle });
        if(!user){
            return res.status(400).send("No User exists with this handle");
        }
        const flag=currentUser.Friends.includes(userhandle);
        // console.log(flag);
        res.status(200).send({user:user,isFriend:flag});
    } catch (error) {
        console.log("error fetching the User ",error)
    }
};
exports.friendToggle=async(req,res)=>{
    try {
        const {id:userhandle}=req.params;
        if(!userhandle){
            return res.status(400).send("Please Enter all the imformation");
        }
        if(userhandle===req.signedCookies.token.userhandle){
            return res.status(400).send("Cannot make onself one's own friend");
        }
        const currentUser = await User.findOne({ userhandle: req.signedCookies.token.userhandle });
        if (!currentUser) {
            return res.status(404).send("User not found");
        }
        const index = currentUser.Friends.indexOf(userhandle);
        if (index !== -1) {
            currentUser.Friends.splice(index, 1);
        } else {
            currentUser.Friends.push(userhandle);
        }

        await currentUser.save();

        res.status(200).send("Friend status toggled successfully");
    } catch (error) {
        console.log("error toggling friend status of user ",error)
        
    }
}
