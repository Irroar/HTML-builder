const fsPromises = require('fs/promises');
const path = require('path');

const pathToDist = path.join(__dirname, 'project-dist');
const pathToStyles = path.join(__dirname, 'styles');

async function createBundle(dist, styles) {
  const files = await fsPromises.readdir(styles, { withFileTypes: true });
  const stylesArr = [];
  for (let file of files) {
    if (file.isFile()) {
      const extention = path.extname(path.join(styles, file.name));
      if (extention === '.css') {
        const style = await fsPromises.readFile(path.join(styles, file.name));
        stylesArr.push(style);
      }
    }
  }

  let flag = true;
  
  for (let style of stylesArr) {
    if (flag) { 
      await fsPromises.writeFile(path.join(dist, 'bundle.css'), style); 
      flag = false;
    }
    else { await fsPromises.writeFile(path.join(dist, 'bundle.css'), style, { flag: 'a' }); }
    
  }
}

createBundle(pathToDist, pathToStyles);