const Problem = require('../models/problems');
const Submissions = require('../models/submissions');
const Testcases = require('../models/Testcases');
const dotenv = require('dotenv');
dotenv.config();

// CREATE
exports.create = async (req, res) => {
  try {
    const { PID, ProblemName, ProblemDescription, ProblemLevel, TimeLimit, Input, Output, Constraints, Tags } = req.body;
    
    if (!(PID && ProblemName && ProblemDescription && ProblemLevel && TimeLimit)) {
        return res.status(400).send("Please enter all the Problem information");
    }
    
    const existingPID = await Problem.findOne({ PID });
    
    if (existingPID) {
        return res.status(400).send("PID is not unique");
    }
    
    const problem = await Problem.create({
        PID,
        ProblemName,
        ProblemDescription,
        ProblemLevel,
        TimeLimit,
        Input,
        Output,
        Constraints,
        Tags: Tags || []
    });
    
    res.status(200).json({ message: "You have successfully created the problem!", problem });
  } 
  catch (error) {
    console.log(error);
    res.status(500).send("Error creating problem");
  }
};

// READ ONE
exports.read = async(req,res) => {
    try {
        const{id} =req.params;
        if(!id){
            return res.status(400).send("Please enter the information");
        }

        let problem= await Problem.findOne({PID:id});
        if(!problem){
            return res.status(404).send("No Such Problem Exists");
        }
        res.status(200).send(problem);
    } catch (error) {
        console.log(error);
    }
}

// READ ALL
exports.readall = async(req,res) => {
    try {
        const problem = await Problem.find({});
        if(!problem){
            return res.status(404).send("The Database is empty");
        }
        res.status(200).send(problem);
    } 
    catch (error) {
        console.log("error in reading all problems");
        console.log(error);
    }
}

// UPDATE
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { PID, ProblemName, ProblemDescription, ProblemLevel, TimeLimit, Input, Output, Constraints, Tags } = req.body;
        
        if (!(id && PID && ProblemName && ProblemDescription && ProblemLevel && TimeLimit)) {
            return res.status(400).send("Please enter the information");
        }
        
        let problem = await Problem.findOne({ PID: id });
        if (!problem) {
            return res.status(404).send("No Such Problem Exists");
        }
        
        let temp = await Problem.findOne({ PID: PID });
        if (temp) {
            if (temp.PID !== id) {
                return res.status(404).send("A problem with the given updated PID already Exists");
            }
        }
        
        if (problem.PID != PID) {
            const problemSubmissions = await Submissions.find({ PID: problem.PID });
            for (const submission of problemSubmissions) {
                submission.PID = PID;
                await submission.save();
            }
            const testcases = await Testcases.find({ PID: problem.PID });
            for (const testcase of testcases) {
                testcase.PID = PID;
                await testcase.save();
            }
        }
        
        problem.PID = PID;
        problem.ProblemName = ProblemName;
        problem.ProblemDescription = ProblemDescription;
        problem.ProblemLevel = ProblemLevel;
        problem.TimeLimit = TimeLimit;
        problem.Input = Input;
        problem.Output = Output;
        problem.Constraints = Constraints;
        problem.Tags = Tags || [];
        
        await problem.save();
        res.status(200).json({ message: "You have successfully updated the problem!", problem });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating problem");
    }
}

// DELETE (renamed to avoid 'delete' keyword issues)
exports.deleteProblem = async(req,res) => {
    try {
        const{id:PID}=req.params;
        if(!PID){
            return res.status(400).send("Please enter the information");
        }

        let problem = await Problem.findOneAndDelete({PID:PID});
        if(!problem){
            return res.status(404).send("No Such Problem Exists");
        }
        const AllSubmissions = await Submissions.deleteMany({PID:PID});
        const AllTests = await Testcases.deleteMany({PID:PID});
        res.status(200).send({message:` ${PID} Problem-and-Testcases-Deleted`, problem});
    } catch (error) {
        console.log(error);
        res.status(400).send({message:"Error Deleting Problem", error});
    }
}