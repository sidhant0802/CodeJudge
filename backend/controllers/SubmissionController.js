const Submission = require('../models/submissions');
const User = require('../models/User');
const problems = require('../models/problems');
const dotenv = require('dotenv');

const allowedFields = ["userhandle", "PID", "ProblemName", "language", "Status"];
const allowedSortFields = ['DateTime', 'userhandle', 'PID', 'ProblemName', 'language', 'Time', 'Memory'];
const allowedSortOrders = ['asc', 'desc'];
dotenv.config();

exports.create = async (req, res) => {
  try {
    const userhandle = req.signedCookies.token.userhandle;
    const user = await User.findOne({ userhandle: userhandle });
    const { code, PID, language, Status, time, memory } = req.body;
    
    if (!(code && PID && language && Status)) {
      return res.status(400).send("Please enter all the submission information");
    }
    
    user.TotalSubmissions = user.TotalSubmissions + 1;
    if (Status === "Accepted") {
      const uniqSubmission = await Submission.findOne({ userhandle: userhandle, PID: PID, Status: Status });
      if (!uniqSubmission) {
        user.TotalAccepted++;
      }
    }
    await user.save();
    
    const Problem = await problems.findOne({ PID: PID });
    const name = Problem.ProblemName;
    const submission = await Submission.create({
      code, userhandle, PID, ProblemName: name, language, Status, Time: time, Memory: memory,
    });
    
    res.status(200).json({ message: "You have successfully created the submission!", submission });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating submission");
  }
};

exports.readbyPID = async (req, res) => {
  try {
    const { id: PID } = req.params;
    if (!PID) {
      return res.status(400).send("No parameter attached in read by PID");
    }
    let submission = await Submission.find({ PID: PID }).sort({ DateTime: -1 });
    res.status(200).send(submission);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error reading submissions by PID");
  }
};

exports.readbyhandle = async (req, res) => {
  try {
    const userhandle = req.signedCookies.token.userhandle;
    if (!userhandle) {
      return res.status(400).send("No such handle");
    }
    let submission = await Submission.find({ userhandle: userhandle }).sort({ DateTime: -1 });
    res.status(200).send(submission);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error reading submissions by handle");
  }
};

exports.readByUserHandle = async (req, res) => {
  try {
    const { userhandle } = req.params;
    if (!userhandle) {
      return res.status(400).send("No userhandle provided");
    }
    const submissions = await Submission.find({ userhandle: userhandle }).sort({ DateTime: -1 });
    res.status(200).send(submissions);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error reading submissions by userhandle");
  }
};

exports.read = async (req, res) => {
  let { filterField, filterValue, sortField = 'DateTime', sortOrder = 'asc', friendsOnly = false, myOnly = false } = req.query;

  if (!allowedSortFields.includes(sortField)) {
    sortField = 'DateTime';
  }
  if (!allowedSortOrders.includes(sortOrder)) {
    sortOrder = 'desc';
  }
  
  let query = {};

  if (allowedFields.includes(filterField)) {
    if (filterField && filterValue) {
      query[filterField] = filterValue;
    }
  }

  try {
    if (filterField === "userhandle") {
      const user = await User.findOne({ userhandle: filterValue });
      if (user) {
        let cnt = await Submission.countDocuments({ userhandle: filterValue });
        user.TotalSubmissions = cnt;
        
        let uniqueProblems = await Submission.aggregate([
          { $match: { userhandle: filterValue, Status: "Accepted" } },
          { $group: { _id: "$PID" } },
          { $count: "uniqueProblemCount" }
        ]);
        
        cnt = uniqueProblems.length > 0 ? uniqueProblems[0].uniqueProblemCount : 0;
        user.TotalAccepted = cnt;
        await user.save();
      }
    }

    let submission;
    const currenthandle = req.signedCookies?.token?.userhandle || null;
    const currentUser = currenthandle ? await User.findOne({ userhandle: currenthandle }) : null;

    if (myOnly === false && friendsOnly === false) {
      submission = await Submission.find(query).sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 });
    } else if (friendsOnly && currentUser) {
      const Friends = currentUser.Friends;
      query.userhandle = { $in: [...Friends, currenthandle] };
      submission = await Submission.find(query).sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 });
    } else if (myOnly && currenthandle) {
      query.userhandle = currenthandle;
      submission = await Submission.find(query).sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 });
    } else {
      submission = [];
    }

    res.status(200).send(submission);
  } catch (error) {
    console.log("Error reading submissions", error);
    res.status(400).send("Error reading submissions");
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findOneAndDelete({ _id: id });
    res.status(200).send({ message: "Successfully Deleted Submission", submission });
  } catch (error) {
    res.status(400).send("Error Deleting Submission");
    console.log(error);
  }
};