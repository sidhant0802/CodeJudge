// const { exec } = require("child_process");
// const executeCpp = (filepath,InputFilePath,outPath,TimeLimit) => {
//     let timeoutSeconds = TimeLimit;
//     timeoutSeconds=Math.min(10,timeoutSeconds);
//     // console.log(timeoutSeconds);

//     return new Promise((resolve, reject) => {
//         const command=`g++ "${filepath}" -o "${outPath}" && "${outPath}" < "${InputFilePath}"`;
//         // const command = `g++ ${filepath} -o ${outPath} && powershell -Command "Start-Process -FilePath ${outPath} -NoNewWindow -Wait; if ($?) { } else { Write-Output 'Process terminated due to timeout' }"`;
//         exec(
//             command,
//             { timeout: timeoutSeconds * 1000 }, // Set timeout in milliseconds
//             (error, stdout, stderr) => {
//                 if (error) {
//                     if (error.killed) {
//                         reject({ error: "sigterm", stderr });
//                     } else {
//                         reject({ error, stderr });
//                     }
//                 } else if (stderr) {
//                     reject(stderr);
//                 } else {
//                     resolve(stdout);
//                 }
//             }
//         );
//     });
// }
// const executeCpp2 = (InputFilePath,outPath,TimeLimit) => {
//     let timeoutSeconds = TimeLimit;
//     timeoutSeconds=Math.min(10,timeoutSeconds);

//     return new Promise((resolve, reject) => {
//         const command= `"${outPath}" < "${InputFilePath}"`;
//         // const command = `g++ ${filepath} -o ${outPath} && powershell -Command "Start-Process -FilePath ${outPath} -NoNewWindow -Wait; if ($?) { } else { Write-Output 'Process terminated due to timeout' }"`;
//         exec(
//             command,
//             { timeout: timeoutSeconds * 1000 }, // Set timeout in milliseconds
//             (error, stdout, stderr) => {
//                 if (error) {
//                     if (error.killed) {
//                         reject({ error: "sigterm", stderr });
//                     } else {
//                         reject({ error, stderr });
//                     }
//                 } else if (stderr) {
//                     reject(stderr);
//                 } else {
//                     resolve(stdout);
//                 }
//             }
//         );
//     });
// }
// module.exports = {
//     executeCpp,executeCpp2,
// };








// Compiler/executeCpp.js
const { exec } = require("child_process");
const path     = require("path");
const fs       = require("fs");
const os       = require("os");

const IS_MAC   = os.platform() === 'darwin';
const IS_WIN   = os.platform() === 'win32';

const outputsDir = path.join(__dirname, "outputs");
if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true });

// Build run command based on OS
function buildRunCmd(outPath, InputFilePath, timeoutSeconds) {
  if (IS_WIN) {
    // Windows: no ulimit support
    return `"${outPath}" < "${InputFilePath}"`;
  }
  if (IS_MAC) {
    // macOS: ulimit -v not supported, only use -t (CPU time)
    return `/bin/bash -c "ulimit -t ${timeoutSeconds}; '${outPath}' < '${InputFilePath}'"`;
  }
  // Linux (AWS): full ulimit support
  return `/bin/bash -c "ulimit -v 131072 -u 50 -t ${timeoutSeconds}; '${outPath}' < '${InputFilePath}'"`;
}

const executeCpp = (filepath, InputFilePath, outPath, TimeLimit) => {
  const timeoutSeconds = Math.min(10, TimeLimit || 5);

  return new Promise((resolve, reject) => {

    // Step 1: Compile
    const compileCmd = `g++ -O2 "${filepath}" -o "${outPath}"`;

    exec(compileCmd, { timeout: 15000 }, (compileErr, _, compileStderr) => {
      if (compileErr) {
        return reject({
          error: {
            stderr: compileStderr || compileErr.message,
            error: 'Compilation Error'
          }
        });
      }

      // Step 2: Run
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

const executeCpp2 = (InputFilePath, outPath, TimeLimit) => {
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

module.exports = { executeCpp, executeCpp2, outputsDir };