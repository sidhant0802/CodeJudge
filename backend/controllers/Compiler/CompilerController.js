// const {generateFile} =require('./generateFile');
// const {generateInputFile} =require('./generateInputFile');
// const { executeCpp ,executeCpp2} = require('./executeCpp');
// const { executeC ,executeC2} = require('./executeC');
// const { executepy } = require('./executepy');
// const fs = require("fs");
// const path = require("path");
const axios=require('axios');

exports.b = async (req, res) => {
  res.send("Hello,world! b");
};
exports.run=async(req,res)=>{
    try{
        const response=await axios.post(
            `${process.env.INSTANCE_IP}/api/compiler/run`,
            req.body
        );
        res.status(200).send(response.data);
    } 
    catch (error) {
        res.status(400).json(error.response.data);
    }
    

}
exports.submit=async (req,res)=>{
    try {
        const response=await axios.post(
            `${process.env.INSTANCE_IP}/api/compiler/submit`,
            req.body
        );
        res.status(200).send(response.data);
    } 
    catch (error) {
        res.status(400).json(error.response.data);
        
    }
}