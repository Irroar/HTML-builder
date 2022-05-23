const fsPromises = require('fs/promises');
const path = require('path');

const pathToDirectory = path.join(__dirname, 'files');

async function copyDir(pathToDir) {
  const pathForCopy = pathToDir + '-copy';
  fsPromises.mkdir(pathForCopy, {recursive: true});
  const files = await fsPromises.readdir(pathToDir);
  const copyFiles = await fsPromises.readdir(pathForCopy);
  for (let file of files) {
    await fsPromises.copyFile(path.join(pathToDir, file), path.join(pathForCopy, file));
  }

  for (let copyFile of copyFiles) {
    if (!files.includes(copyFile)) { await fsPromises.rm(path.join(pathForCopy, copyFile)); }
  }
  
}

copyDir(pathToDirectory);