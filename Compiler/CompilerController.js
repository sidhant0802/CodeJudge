// const {generateFile} =require('./generateFile');
// const {generateInputFile} =require('./generateInputFile');
// const { executeCpp ,executeCpp2} = require('./executeCpp');
// const { executeC ,executeC2} = require('./executeC');
// const { executepy } = require('./executepy');
// const fs = require("fs");
// const path = require("path");
// exports.b = async (req, res) => {
//   res.send("Hello,world! b");
// };
// exports.run=async(req,res)=>{
//     const {language="cpp",code,input,TimeLimit}=req.body;
//     const outputPath = path.join(__dirname, "outputs");
//     if (!fs.existsSync(outputPath)) {
//         fs.mkdirSync(outputPath, { recursive: true });
//     }
//     if(code===undefined){
//         return res.status(400).json({success:false,error:"Empty Code body"});
//     }
//     const st=performance.now();
//     try{
//         const filePath= await generateFile(language,code);
//         const InputFilePath= await generateInputFile(input);
//         const uniqID = path.basename(filePath).split(".")[0];
//         const outPath = path.join(outputPath, `${uniqID}.out`);

//         if(language==="cpp"){
//             const output=await executeCpp(filePath,InputFilePath,outPath,TimeLimit);
//             const en=performance.now();
//             res.json({filePath,InputFilePath,output,outPath,Time:en-st});
//         }
//         else if(language==="c"){
//             const output=await executeC(filePath,InputFilePath,outPath,TimeLimit);
//             const en=performance.now();
//             res.json({filePath,InputFilePath,output,outPath,Time:en-st});
//         }
//         else if(language==="py"){
//             const output=await executepy(filePath,InputFilePath,TimeLimit);
//             const en=performance.now();
//             res.json({filePath,InputFilePath,output,outPath,Time:en-st});
//         }
//     } 
//     catch (error) {
//         console.log("COMPILER RUN ERROR:", error);
//         if(error.error=="sigterm"){
//             res.status(200).json({output:"sigterm",Time:TimeLimit*1000});
//         }
//         else{
//             res.status(400).json({
//                 success:false,
//                 error: {
//                     message: "error submitting code in compiler controller",
//                     error: {
//                         stderr: error.stderr || null,
//                         error: error.error || error.message || "unknown error"
//                     }
//                 }
//             });
//         }
//     }
// }

// exports.submit=async (req,res)=>{
//     const{language="cpp",input,outPath,TimeLimit}=req.body;
//     const InputFilePath= await generateInputFile(input);
//     const st=performance.now();

//     if(!outPath){
//         return res.status(400).json({success:false,error:"No output Path given while submitting"});
//     }
//     try {
//         if(language==="cpp"){
//             const output=await executeCpp2(InputFilePath,outPath,TimeLimit);
//             const en=performance.now();
//             res.json({InputFilePath,output,Time:en-st});
//         }
//         else if(language==="c"){
//             const output=await executeC2(InputFilePath,outPath,TimeLimit);
//             const en=performance.now();
//             res.json({InputFilePath,output,Time:en-st});
//         }
//         else if(language==="py"){
//             const output=await executepy(outPath,InputFilePath,TimeLimit);
//             const en=performance.now();
//             res.json({InputFilePath,output,Time:en-st});
//         }
//     } 
//     catch (error) {
//         console.log("COMPILER SUBMIT ERROR:", error);
//         if(error.error==="sigterm"){
//             res.status(200).json({output:"sigterm",Time:TimeLimit*1000});
//         }
//         else{
//             res.status(400).json({
//                 success:false,
//                 error: {
//                     message: "error submitting code in compiler controller",
//                     error: {
//                         stderr: error.stderr || null,
//                         error: error.error || error.message || "unknown error"
//                     }
//                 }
//             });
//         }
//     }
// }












// Compiler/CompilerController.js
const { performance } = require('perf_hooks');
const { generateFile, cleanupFile } = require('./generateFile');
const { generateInputFile }         = require('./generateInputFile');
const { executeCpp, executeCpp2 }   = require('./executeCpp');
const { executeC, executeC2 }       = require('./executeC');
const { executepy }                 = require('./executepy');
const fs   = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

// Periodic cleanup — every 2 hours, delete files older than 2 hours
const TWO_HOURS = 2 * 60 * 60 * 1000;
setInterval(() => {
  const dirs = [
    path.join(__dirname, 'codes'),
    path.join(__dirname, 'inputs'),
    path.join(__dirname, 'outputs'),
  ];
  const now = Date.now();
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    try {
      fs.readdirSync(dir).forEach(file => {
        const fp = path.join(dir, file);
        try {
          if (now - fs.statSync(fp).mtimeMs > TWO_HOURS) {
            fs.unlinkSync(fp);
          }
        } catch (e) { /* silent */ }
      });
    } catch (e) { /* silent */ }
  });
}, TWO_HOURS);

// ── /run ──
exports.run = async (req, res) => {
  const { language = "cpp", code, input, TimeLimit } = req.body;

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty Code body" });
  }

  let filePath      = null;
  let InputFilePath = null;
  const st          = performance.now();

  try {
    filePath      = await generateFile(language, code);
    InputFilePath = await generateInputFile(input || '');

    const uniqID = path.basename(filePath).split(".")[0];
    const outPath = path.join(outputPath, `${uniqID}.out`);

    let output;

    if (language === "cpp") {
      output = await executeCpp(filePath, InputFilePath, outPath, TimeLimit);
    } else if (language === "c") {
      output = await executeC(filePath, InputFilePath, outPath, TimeLimit);
    } else if (language === "py") {
      output = await executepy(filePath, InputFilePath, TimeLimit);
    } else {
      return res.status(400).json({ success: false, error: "Unsupported language" });
    }

    const en = performance.now();

    // Cleanup code + input immediately
    cleanupFile(filePath);
    cleanupFile(InputFilePath);

    return res.json({
      output: output || '',
      outPath,
      Time: en - st,
    });

  } catch (error) {
    const en = performance.now();
    console.log("RUN ERROR:", error);

    cleanupFile(filePath);
    cleanupFile(InputFilePath);

    if (
      error?.error?.error === "sigterm" ||
      error?.error === "sigterm"
    ) {
      return res.status(200).json({
        output: "sigterm",
        Time: TimeLimit * 1000
      });
    }

    return res.status(400).json({
      success: false,
      error: {
        message: "Compiler error",
        error: {
          stderr: error?.error?.stderr || error?.stderr || null,
          error:  error?.error?.error  || error?.error  || "unknown error"
        }
      }
    });
  }
};

// ── /submit ──
exports.submit = async (req, res) => {
  const { language = "cpp", input, outPath, TimeLimit } = req.body;

  if (!outPath) {
    return res.status(400).json({ success: false, error: "No outPath given" });
  }

  let InputFilePath = null;
  const st = performance.now();

  try {
    InputFilePath = await generateInputFile(input || '');

    let output;

    if (language === "cpp") {
      output = await executeCpp2(InputFilePath, outPath, TimeLimit);
    } else if (language === "c") {
      output = await executeC2(InputFilePath, outPath, TimeLimit);
    } else if (language === "py") {
      output = await executepy(outPath, InputFilePath, TimeLimit);
    } else {
      return res.status(400).json({ success: false, error: "Unsupported language" });
    }

    const en = performance.now();

    cleanupFile(InputFilePath);

    return res.json({ output, Time: en - st });

  } catch (error) {
    console.log("SUBMIT ERROR:", error);
    cleanupFile(InputFilePath);

    if (
      error?.error?.error === "sigterm" ||
      error?.error === "sigterm"
    ) {
      return res.status(200).json({
        output: "sigterm",
        Time: TimeLimit * 1000
      });
    }

    return res.status(400).json({
      success: false,
      error: {
        message: "Submit error",
        error: {
          stderr: error?.error?.stderr || error?.stderr || null,
          error:  error?.error?.error  || error?.error  || "unknown error"
        }
      }
    });
  }
};

exports.b = async (req, res) => res.send("Hello, world! b");