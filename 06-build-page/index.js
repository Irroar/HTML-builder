const fsPromises = require('fs/promises');
const path = require('path');

const pathToDist = path.join(__dirname, 'project-dist');
const pathToStyles = path.join(__dirname, 'styles');
const pathToComponents = path.join(__dirname, 'components');
const pathToTemplate = path.join(__dirname, 'template.html');

async function buildPage(dist, styles, components, template) {
  await fsPromises.mkdir(dist, {recursive: true});
  await fsPromises.mkdir(path.join(dist, 'assets'), {recursive: true});
  createCssBundle(dist, styles);
  createIndex(dist, components, template);
  copyAssets(dist, 'assets');
}

async function createCssBundle(dist, styles) {
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
      await fsPromises.writeFile(path.join(dist, 'style.css'), style); 
      flag = false;
    }
    else { await fsPromises.writeFile(path.join(dist, 'style.css'), style, { flag: 'a' }); }
    
  }
}

async function createIndex(dist, components, template) {
  const templateData = await fsPromises.readFile(template);
  let templateHtml = templateData.toString();

  const componentFiles = await fsPromises.readdir(components, { withFileTypes: true });

  for (let componentFile of componentFiles) {
    if (componentFile.isFile() && path.extname(componentFile.name) === '.html') {
      const componentData = await fsPromises.readFile(path.join(components, componentFile.name));
      templateHtml = templateHtml.replace(new RegExp(`{{${path.basename(componentFile.name, path.extname(componentFile.name))}}}`), componentData.toString());
    }
  }

  await fsPromises.writeFile(path.join(dist, 'index.html'), templateHtml);
}

async function copyAssets(dist, folderToCopy) {
  const destinationFolder = path.join(dist, folderToCopy);  
  const folderToCopyPath = path.join(__dirname, folderToCopy);
  fsPromises.mkdir(destinationFolder, {recursive: true});
  const files = await fsPromises.readdir(folderToCopyPath, {withFileTypes: true});
  const copyFiles = await fsPromises.readdir(destinationFolder, {withFileTypes: true});
  for (let file of files) {
    if (file.isDirectory()) { 
      copyAssets(dist, path.join(folderToCopy, file.name));
    } else if (file.isFile()) {
      await fsPromises.copyFile(path.join(folderToCopyPath, file.name), path.join(destinationFolder, file.name));
    }
  }

  for (let copyFile of copyFiles) {
    if (copyFile.isFile()) {
      if (!files.map((item) => item.name).includes(copyFile.name)) { await fsPromises.rm(path.join(destinationFolder, copyFile.name)); }
    } else if (copyFile.isDirectory()) {
      if (!(files.map((item) => item.name).includes(copyFile.name))) {
        await fsPromises.rm(path.join(destinationFolder, copyFile.name), {force: true, recursive: true});
        
      }
    }
  }
}


buildPage(pathToDist, pathToStyles, pathToComponents, pathToTemplate);