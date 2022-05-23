const fs = require('fs');
const path = require('path');
const { stdin : input, stdout : output } = require('process');
const readline = require('readline');

const pathToFile = path.join(__dirname, 'text.txt');

const rl = readline.createInterface({ input, output });

let writableStream = fs.createWriteStream(pathToFile);
output.write('Hello where! Waiting for the input...\n');

rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    writableStream.end();
    rl.close();
  }
  writableStream.write(`${input}\n`);
});

rl.on('close', () => {
  process.exit();
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', (code) => {
  if (code === 0) { output.write('Goodbye!'); }
});
