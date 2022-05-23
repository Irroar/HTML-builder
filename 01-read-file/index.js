const fs = require('fs');
const path = require('path');
const process = require('process');

const pathToFile = path.join(__dirname, 'text.txt');

const stream = new fs.ReadStream(pathToFile);

stream.on('readable', () => {
  const data = stream.read();
  if (data !== null) { process.stdout.write(data.toString()); }
});
