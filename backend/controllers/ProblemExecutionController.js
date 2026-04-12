const Problem = require('../models/problems');
const Test = require('../models/Testcases');
const {generateInputFile }=require('./Compiler/generateInputFile');
const {generateFile }=require('./Compiler/generateFile');
const {executeCpp }=require('./Compiler/executeCpp');
const {executeC }=require('./Compiler/executeC');
const {executepy }=require('./Compiler/executepy');

exports.submitAll= async (req,res)=>{
    const{id:PID} =req.params;
    const {language,code}=req.body;
    if(!(code&&language&&PID)){
        return res.status(400).send("Enter All information");
    }
    try {
        const Testcases=await Test.find({PID:PID});
        const codeFilePath=await generateFile(language,code);
        const results=[];
        let allpassed=1;
        let i=0;
        for(const testcase of Testcases){
            i++;
            const content=testcase.Input;
            const InputFilePath= await generateInputFile(content);
            let output="";
            try {
                if(language==="cpp"){
                    output=await executeCpp(codeFilePath,InputFilePath);
                }
                else if(language==="c"){
                    output=await executeC(codeFilePath,InputFilePath);
                }
                else if(language==="py"){
                    output=await executepy(codeFilePath,InputFilePath);
                }
            } 
            catch (error) {
                console.error(`Error executing code at testcase ${i}`, error);
                // console.log(error);
                allpassed = false;
                results.push(0);
                continue;
            }
            
            if(output.trim() === testcase.Solution.trim()){
                results.push(1);
            }
            else{
                allpassed=0;
                results.push(0);
            }
        }
        if(allpassed===1){
            res.status(200).json({message:"Accepted"});
        }
        else{
            const wronglist=[];
            for(let i=0;i<results.length;i++){
                if(results[i]===0){
                    wronglist.push(i+1);
                }
            }
            res.status(200).json({message:"wrong answer",list: wronglist});
        }
    } catch (error) {
        console.error("Error processing submission:", error);
        res.status(400).send("An error occurred while processing the submission.");
    }     
}
