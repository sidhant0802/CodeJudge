// const {exec} = require("child_process");
// const executepy=(filepath,InputFilePath,TimeLimit)=>{
//     // console.log(outPath);
//     const timeoutSeconds = TimeLimit;
//     return new Promise((resolve,reject)=>{
//         exec(
//             `python ${filepath} < ${InputFilePath}`,
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
//     executepy,
// };






// Compiler/executepy.js
const { exec } = require("child_process");
const os       = require("os");

const IS_MAC = os.platform() === 'darwin';
const IS_WIN = os.platform() === 'win32';

function buildPyCmd(filepath, InputFilePath, timeoutSeconds) {
  if (IS_WIN) {
    // Windows: python or python3 depending on installation
    return `python "${filepath}" < "${InputFilePath}"`;
  }
  if (IS_MAC) {
    // macOS: python3 exists, limited ulimit
    return `/bin/bash -c "ulimit -t ${timeoutSeconds}; python3 '${filepath}' < '${InputFilePath}'"`;
  }
  // Linux: full ulimit, 256MB for Python
  return `/bin/bash -c "ulimit -v 262144 -u 50 -t ${timeoutSeconds}; python3 '${filepath}' < '${InputFilePath}'"`;
}

const executepy = (filepath, InputFilePath, TimeLimit) => {
  const timeoutSeconds = Math.min(10, TimeLimit || 5);

  return new Promise((resolve, reject) => {
    const runCmd = buildPyCmd(filepath, InputFilePath, timeoutSeconds);

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

module.exports = { executepy };