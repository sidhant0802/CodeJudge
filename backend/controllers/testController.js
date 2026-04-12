const Test = require('../models/Testcases');
const dotenv = require('dotenv');
dotenv.config();
// GET all examples
exports.create = async (req, res) => {
  try {
    const{TestcaseName,PID,Input,Solution}=req.body;
    if(!(TestcaseName&&PID&&Input&&Solution)){
        return res.status(400).send("Please enter all the Test information");
    }
    const testcase=await Test.create({
        TestcaseName,PID,Input,Solution
    });
    res.status(200).json({message: "You have succesfully created the testcase!",testcase});
  } 
  catch (error) {
    console.log(error);
  }
};
exports.b = async (req, res) => {
  res.send("Hello,world! b");
};
exports.read=async(req,res)=>{
    try {
        const{id} =req.params;
        if(!id){
            return res.status(400).send("Please enter all the information");
        }
        let test= await Test.findOne({_id:id});
        // if(!test){
        //     return res.status(404).send("No Such Test Exists");
        // }
        res.status(200).send(test);
    } catch (error) {
        console.log(error);
    }
}
exports.readbyPID=async(req,res)=>{
    try {
        const{id} =req.params;
        if(!id){
            return res.status(400).send("Please enter all the information");
        }
        
        // let test= await Test.findOne({PID:id});
        // if(!test){
        //     return res.status(404).send("No Test Exists related to this PID");
        // }
        let test= await Test.find({PID:id});
        // console.log(test);
        res.status(200).send(test);
    } 
    catch (error) {
        console.log(error);
    }
}
exports.update=async(req,res)=>{
    try {
        const {id}=req.params;
        const{TestcaseName,PID,Input,Solution}=req.body;
        if(!(id&&TestcaseName&&PID&&Input&&Solution)){
            return res.status(400).send("Please enter all the information");
        }
        let test= await Test.findOne({_id:id});
        test.TestcaseName=TestcaseName;
        test.PID=PID;
        test.Input=Input;
        test.Solution=Solution;
        // console.log(TID);
        const updatedtest = await test.save();
        res.status(200).json({message: "You have succesfully updated the testcase!",test});

        // res.status(200).send(p1roblem);
    } catch (error) {
        console.log("Error found at backend testcontroller update")
        console.log(error);
    }
}
exports.deletesingle= async(req,res)=>{
    try {
        const{id}=req.params;
        if(!id){
            return res.status(400).send("Please enter all the information");
        }
        // console.log(id);

        let test= await Test.findOneAndDelete({_id:id});
        // console.log(test);
        if(!test){
            return res.status(404).send("No Such Test Exists");
        }
        res.status(200).send({message:` ${test.TestcaseName} Test-Deleted`,test});
    } catch (error) {
        console.log(error);
    }
}
exports.deleteAllbyPID= async(req,res)=>{
    try {
        const{ID}=req.body;
        if(!ID){
            return res.status(400).send("Please enter all the information");
        }
        // console.log(ID);
        let temp=await Test.findOne({PID:ID});
        if(!temp){
            return res.status(404).send("No Test Exists for this problem");
        }
        let test= await Test.deleteMany({PID:ID});
        // console.log(test);
        // if(!test){
        //     return res.status(404).send("No Test Exists for this problem");
        // }
        res.status(200).send({message:` ${ID} Test-Deleted`,test});
    } catch (error) {
        console.log(error);
    }
}