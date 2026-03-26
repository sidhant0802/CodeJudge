// const {exec} = require("child_process");
// // const fs =require("fs")

// // const outputPath=path.join(__dirname,"outputs");
// // // console.log(outputPath);
// // if(!fs.existsSync(outputPath)){
// //     fs.mkdirSync(outputPath,{recursive:true});
// // }

// const executeC=(filepath,InputFilePath,outPath,TimeLimit)=>{
//     // const outPath=path.join(outputPath,`${uniqID}.exe`);
//     // console.log(outPath);
//     const timeoutSeconds = TimeLimit;
//     return new Promise((resolve,reject)=>{
//         exec(
//             // `gcc ${filepath} -o ${outPath}  &&cd ${outputPath} && .\\${uniqID}.exe <${InputFilePath}`,
//             // `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out < ${inputPath}`
//             `gcc "${filepath}" -o "${outPath}" && "${outPath}" < "${InputFilePath}"`,
//             {timeout: timeoutSeconds*1000},
//             (error,stdout,stderr)=>{
//                if(error){
//                 if(error.killed){
//                     reject({ error: "sigterm", stderr });
//                 }
//                 else{
//                     reject({error,stderr});
//                 }
                
//                } 
//                if(stderr){
//                 reject(stderr);
//                }
//                resolve(stdout);
//             }
//         );
//     })
// }
// const executeC2=(InputFilePath,outPath,TimeLimit)=>{
//     // console.log(outPath);
//     // const timeoutSeconds = TimeLimit;
//     let timeoutSeconds = TimeLimit;
//     timeoutSeconds=Math.min(10,timeoutSeconds);
//     return new Promise((resolve,reject)=>{
//         exec(
//             // `gcc ${filepath} -o ${outPath}  &&cd ${outputPath} && .\\${uniqID}.exe <${InputFilePath}`,
//             // `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out < ${inputPath}`
//             `"${outPath}" < "${InputFilePath}"`,

//             {timeout: timeoutSeconds*1000},
//             (error,stdout,stderr)=>{
//                if(error){
//                 if(error.killed){
//                     reject({ error: "sigterm", stderr });
//                 }
//                 else{
//                     reject({error,stderr});
//                 }
                
//                } 
//                if(stderr){
//                 reject(stderr);
//                }
//                resolve(stdout);
//             }
//         );
//     })
// }
// module.exports ={
//     executeC,executeC2,
// };





// Compiler/executeC.js
const { exec } = require("child_process");
const path     = require("path");
const fs       = require("fs");
const os       = require("os");

const IS_MAC = os.platform() === 'darwin';
const IS_WIN = os.platform() === 'win32';

const outputsDir = path.join(__dirname, "outputs");
if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true });

function buildRunCmd(outPath, InputFilePath, timeoutSeconds) {
  if (IS_WIN) {
    return `"${outPath}" < "${InputFilePath}"`;
  }
  if (IS_MAC) {
    return `/bin/bash -c "ulimit -t ${timeoutSeconds}; '${outPath}' < '${InputFilePath}'"`;
  }
  return `/bin/bash -c "ulimit -v 131072 -u 50 -t ${timeoutSeconds}; '${outPath}' < '${InputFilePath}'"`;
}

const executeC = (filepath, InputFilePath, outPath, TimeLimit) => {
  const timeoutSeconds = Math.min(10, TimeLimit || 5);

  return new Promise((resolve, reject) => {

    const compileCmd = `gcc -O2 "${filepath}" -o "${outPath}"`;

    exec(compileCmd, { timeout: 15000 }, (compileErr, _, compileStderr) => {
      if (compileErr) {
        return reject({
          error: {
            stderr: compileStderr || compileErr.message,
            error: 'Compilation Error'
          }
        });
      }

      const runCmd = buildRunCmd(outPath, InputFilePath, timeoutSeconds);

      exec(
        runCmd,
        { timeout: (timeoutSeconds + 1) * 1000 },
        (runErr, stdout, stderr) => {
          if (runErr) {
            if (runErr.killed || runErr.signal === 'SIGTERM') {
              return reject({ error: { error: 'sigterm' } });
            }
            return reject({
              error: { stderr: stderr || runErr.message }
            });
          }
          return resolve(stdout);
        }
      );
    });
  });
};

const executeC2 = (InputFilePath, outPath, TimeLimit) => {
  const timeoutSeconds = Math.min(10, TimeLimit || 5);

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outPath)) {
      return reject({
        error: {
          error: 'Binary not found',
          stderr: 'Compiled binary not found. Please resubmit.'
        }
      });
    }

    const runCmd = buildRunCmd(outPath, InputFilePath, timeoutSeconds);

    exec(
      runCmd,
      { timeout: (timeoutSeconds + 1) * 1000 },
      (runErr, stdout, stderr) => {
        if (runErr) {
          if (runErr.killed || runErr.signal === 'SIGTERM') {
            return reject({ error: { error: 'sigterm' } });
          }
          return reject({
            error: { stderr: stderr || runErr.message }
          });
        }
        return resolve(stdout);
      }
    );
  });
};

module.exports = { executeC, executeC2 };