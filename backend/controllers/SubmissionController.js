const Submission = require('../models/submissions');
const User = require('../models/User');
const problems = require('../models/problems');

const dotenv = require('dotenv');
// const mongoose=require('mongoose');
const allowedFields=["userhandle","PID","ProblemName","language","Status"]
const allowedSortFields = [ 'DateTime', 'userhandle','PID','ProblemName','language','Time','Memory'];
const allowedSortOrders = ['asc', 'desc'];
dotenv.config();
// GET all examples
exports.create = async (req, res) => {
  try {
    const userhandle=req.signedCookies.token.userhandle;
    const user=await User.findOne({userhandle:userhandle});
    const{ code,PID,language,Status,time,memory}=req.body;
    if(!(code&&PID&&language&&Status)){
        return res.status(400).send("Please enter all the submission information");
    }
    user.TotalSubmissions=user.TotalSubmissions+1;
    if(Status==="Accepted"){
        const uniqSubmission=await Submission.findOne({userhandle:userhandle,PID:PID,Status:Status});
        if(!uniqSubmission){
            user.TotalAccepted++;
        }
    }
    await user.save();
    const Problem=await problems.findOne({PID:PID});
    const name=Problem.ProblemName;
    const submission=await Submission.create({
        code,userhandle,PID,ProblemName:name,language,Status,Time:time,Memory:memory,
    });
    res.status(200).json({message: "You have succesfully created the submission!",submission});
  } 
  catch (error) {
    console.log(error);
  }
};
exports.b = async (req, res) => {
  res.send("Hello,world! b");
};
exports.readbyPID=async(req,res)=>{
    try {
        const {id:PID}=req.params;
        if(!PID){
            return res.status(400).send("No parametre Attached in read by PID");
        }
        let submission= await Submission.find({PID:PID}).sort({DateTime:-1});
        res.status(200).send(submission);
    } 
    catch (error) {
        console.log(error);
    }
}
exports.readbyhandle=async(req,res)=>{
    try {
        const userhandle=req.signedCookies.token.userhandle;
        if(!userhandle){
            return res.status(400).send("No such handle ");
        }
        let submission= await Submission.find({userhandle:userhandle}).sort({DateTime:-1});

        res.status(200).send(submission);
    } 
    catch (error) {
        console.log(error);
    }
}
exports.read=async(req,res)=>{
  let {filterField,filterValue, sortField = 'DateTime', sortOrder = 'asc',friendsOnly=false,myOnly=false } = req.query;
  // console.log("YES");
    if (!allowedSortFields.includes(sortField)) {
      sortField = 'DateTime'; // Default field
    }
    if (!allowedSortOrders.includes(sortOrder)) {
      sortOrder = 'desc'; // Default order
    }
    let query={};
    
    if(allowedFields.includes(filterField)){
      if (filterField && filterValue) {
        query[filterField] = filterValue;
      }
    }
    try {
      if(filterField==="userhandle"){
        const user=await User.findOne({userhandle:filterValue});
        let cnt=await Submission.countDocuments({userhandle:filterValue});
        user.TotalSubmissions=cnt;
        let uniqueProblems = await Submission.aggregate([
          {
            $match: {
              userhandle: filterValue,
              Status: "Accepted"
            }
          },
          {
            $group: {
              _id: "$PID"
            }
          },
          {
            $count: "uniqueProblemCount"
          }
        ]);
        cnt = uniqueProblems.length > 0 ? uniqueProblems[0].uniqueProblemCount : 0;
        user.TotalAccepted=cnt;
        await user.save();
      }
      let submission;
      const currentUser=await User.findOne({userhandle:req.signedCookies.token.userhandle});
      const currenthandle=req.signedCookies.token.userhandle;
      // console.log(myOnly,friendsOnly);
      if(myOnly===false&&friendsOnly===false){
        submission=await Submission.find(query).sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 });
      }
      else if(friendsOnly){
        const Friends=currentUser.Friends;
        query.userhandle={$in:[...Friends,currenthandle]};

        submission=await Submission.find(query).sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 });
      }
      else if(myOnly){
        query.userhandle=currenthandle;
        // console.log(query);
        submission=await Submission.find(query).sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 });
      }

      res.status(200).send(submission);
    } catch (error) {
      console.log("Error reading submissions by only read",error);
      res.status(400).send("Error reading submissions by only read");
    }
}
exports.delete=async(req,res)=>{
  try {
    const {id}=req.params;
    const submission=await Submission.findOneAndDelete({_id:id});
    res.status(200).send({message: "Succesfully Deleted Submission",submission});
  } catch (error) {
    res.status(400).send("Error Deleting Submission");
    console.log(error);
  }
}









