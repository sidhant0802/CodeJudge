// const fs=require('fs');
// const path=require('path');
// const {v4:uuid}=require('uuid');

// const dirCodes= path.join(__dirname,'codes');

// if(!fs.existsSync(dirCodes)){
//     fs.mkdirSync(dirCodes,{recursive:true});
// }
// const generateFile=async(format,content)=>{
//     const uniqID=uuid();
//     const filename=`${uniqID}.${format}`;
//     const filePath=path.join(dirCodes,filename);
//     await fs.writeFileSync(filePath,content);
//     return filePath;
// };

// module.exports={generateFile};





// Compiler/generateFile.js
const fs   = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirCodes = path.join(__dirname, 'codes');
if (!fs.existsSync(dirCodes)) fs.mkdirSync(dirCodes, { recursive: true });

const generateFile = async (format, content) => {
  const uniqID   = uuid();
  const filename = `${uniqID}.${format}`;
  const filePath = path.join(dirCodes, filename);
  fs.writeFileSync(filePath, content);
  return filePath;
};

const cleanupFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (e) { /* silent */ }
};

module.exports = { generateFile, cleanupFile };