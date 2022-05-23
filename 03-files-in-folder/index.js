const fsPromises = require('fs/promises');
const path = require('path');
const { stdout : output } = require('process');

const pathToFolder = path.join(__dirname, 'secret-folder');

async function getFilesInfo(pathToFolder) {
  const files = await fsPromises.readdir(pathToFolder, { withFileTypes: true });
  for (let file of files) {
    if (file.isFile()) { 
      const pathToFile = path.join(pathToFolder, file.name);
      const stats = await fsPromises.stat(pathToFile);
      const extention = path.extname(pathToFile);
      const fileName = path.basename(pathToFile, extention);
      const size = stats.size;
      output.write(`${fileName} - ${extention.slice(1)} - ${size} bytes\n`);
    }
  }
}

getFilesInfo(pathToFolder);