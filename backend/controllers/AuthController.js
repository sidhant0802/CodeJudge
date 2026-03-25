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
exports.myFriends=async(req,res)=>{
    try {
        const currentUser = await User.findOne({ userhandle: req.signedCookies.token.userhandle });
        if (!currentUser) {
            return res.status(404).send("User not found");
        }
        res.status(200).send(currentUser.Friends);
    } catch (error) {
        return res.status(400).send("Error Showing all friends");
    }
}
exports.readAll=async(req,res)=>{
let { sortField = 'DateTime', sortOrder = 'asc' } = req.query;

    if (!allowedSortFields.includes(sortField)) {
      sortField = 'DateTime'; // Default field
    }
    if (!allowedSortOrders.includes(sortOrder)) {
      sortOrder = 'asc'; // Default order
    }
    try {
        // const Users=await User.find();
        const Users = await User.find().sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 });
        res.status(200).send(Users);
    } catch (error) {
        res.status(400).send("error fetching the UsersList");
        console.log("error fetching the UsersList ",error)
    }
};
exports.update=async(req,res)=>{
    try {
        const userhandle=req.signedCookies.token.userhandle;
        // console.log(userhandle);
        const {id:givenHandle}=req.params;
        const {firstName,lastName,email,oldPassword,newPassword,confirmPassword}=req.body;
        if(!(firstName&&lastName&&email&&oldPassword)){
            return res.status(400).send("Enter Complete Information");
        }
        if(givenHandle!==userhandle){
            return res.status(400).send("You Don't own this handle");
        }

        const user=await User.findOne({userhandle});
        if(!user){
            return res.status(400).send("No User exists with this handle");
        }

        const enteredPassword= await bcrypt.compare(oldPassword,user.password);
        if(!enteredPassword){
            return res.status(404).send("Old Password does not match");
        }

        const existingUser2=await User.findOne({ email });
        if(existingUser2){
            if(existingUser2.userhandle!==userhandle){
                return res.status(400).send("User already exists with the same email");
            }
        }

        user.firstName=firstName;
        user.lastName=lastName;
        user.email=email;
        if(newPassword){
            if(newPassword===confirmPassword){
                const hashedPassword= await bcrypt.hash(newPassword,10);
                user.password=hashedPassword;
            }
            else{
                return res.status(400).send("Confirmation Mismatch");
            }
        }
        await user.save();
        res.status(200).send({message:"Succesfully Updated",user});
    } catch (error) {
        console.log("error fetching the User ",error)
        return res.status(400).send("Updation Failed");
    }
    
};
exports.updateAdmin=async(req,res)=>{
    try {
        const {id:userhandle}=req.params;
        const {handle,firstName,lastName,email}=req.body;
        if(!(handle&&firstName&&lastName&&email)){
            return res.status(400).send("Enter Complete Information");
        }
        const user=await User.findOne({userhandle});
        if(!user){
            return res.status(400).send("No User exists with this handle");
        }
        const existingUser2=await User.findOne({ email });
        if(existingUser2){
            if(existingUser2.userhandle!==userhandle){
                return res.status(400).send("User already exists with the same email");
            }
        }
        const existingUser=await User.findOne({ handle });
        if(existingUser){
            if(handle!==userhandle){
                return res.status(400).send("User already exists with the same handle");
            }
        }
        if(user.userhandle!==handle){
            const userSubmissions=await Submissions.find({userhandle:user.userhandle});
            for(const submission of userSubmissions){
                submission.userhandle=handle;
                await submission.save();
            };
            user.userhandle=handle;
        }
        user.firstName=firstName;
        user.lastName=lastName;
        user.email=email;
        await user.save();
        res.status(200).send({message:`Succesfully Updated ${userhandle} & related submissions`,user});
    } catch (error) {
        console.log("error updating the User ",error)
        return res.status(400).send("Updation Failed");
    }
};
exports.createAdmin=async(req,res)=>{
    const {id:userhandle}=req.params;
    try {
        if(userhandle==='abc'){
            return res.status(400).send("Cannot Change Role of this user");
        }
        const existingUser=await User.findOne({userhandle:userhandle});
        
        if(!existingUser){
            return res.status(400).send("No Such User exists with this handle");
        }
        if(userhandle===req.signedCookies.token.userhandle){
            return res.status(400).send("You cannot change your own role");
        }
        if(existingUser.role==='admin'){
            existingUser.role='user';
        }
        else if(existingUser.role==='user'){
            existingUser.role='admin';
        }
        await existingUser.save();
        return res.status(200).send({message:"Successfully changed user role",existingUser});
    } catch (error) {
        console.log("Error at create admin");
        console.log(error);
        return res.status(400).send("Failed to change user role ");
    }
    
}
exports.delete = async (req, res) => {
    try {
      //get all the data from the frontend
      const {id: handle}=req.params;
  
      //check that all the data should exist
      if(!(handle)){
          return res.status(400).send("Please enter all the information");
      }
      const existingUser=await User.findOneAndDelete({ userhandle:handle });
    //   console.log(existingUser);
    if(!existingUser){
        return res.status(400).send("No such user exists with this handle");
    }
    await Submissions.deleteMany({userhandle:handle})
      res.status(200).json({message: `You have succesfully deleted  handle ${handle}! and its related submissions`,existingUser})
  } 
  catch (error) {
      console.log(error);
      res.status(400).send(`Deletion of handle ${handle} failed`)
  }
  };
exports.login= async(req,res)=>{
try {
    //get all the data from frontend
    const {line,password}=req.body;
    if(!(line&&password)){
        return res.status(400).send("Please enter all the information");
    }

    //add more validations

    //find the user in the db
    let user= await User.findOne({email:line});
    if(!user){
        user=await User.findOne({userhandle:line});
        if(!user){
            return res.status(404).send("User not found");
        }
    }
     
    //comparing the password
    const enteredPassword= await bcrypt.compare(password,user.password);
    if(!enteredPassword){
        return res.status(404).send("Password does not match");
    }

    //token creation
    const token=jwt.sign({id:user._id, role:user.role},process.env.SECRET_KEY,{
        expiresIn:"1h"
    });
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
        message:"You have succeddfully logged in!",
        success: true,
        token,
        role:user.role,
        userhandle:user.userhandle
    });
    // res.status(200).send(user.role);
} 
catch (error) {
    console.log(error);
}
}
exports.logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).send({ message: 'Logout successful' })
    } catch (error) {
        console.log(error);
        res.status(200).send({message:"Logout Failed"});
    }
     
};
exports.upload=async (req,res)=>{
    try {
        const{id:userhandle}=req.params;
        if(!req.file){
            return res.status(400).send('No file uploaded.');
        }
        if(userhandle!==req.signedCookies.token.userhandle){
            if(fs.existsSync(`uploads/${userhandle}.jpg`)){
                fs.unlinkSync(`uploads/${userhandle}.jpg`);
                // console.log("Extra file deleted");
            }
            return res.status(400).send("You Don't Own this handle");
        }
        const user=await User.findOne({userhandle:userhandle});
        user.imgPath=`uploads/${userhandle}.jpg`;
        user.save();
        res.status(200).send({message:"image uploaded succesfully",imgPath:user.imgPath});
    } catch (error) {
        res.status(400).send("image uploadation failed");
        console.log(error);
    }
}










