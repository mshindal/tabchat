const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

console.log('Zipping extensions folder into extension.zip...');

const pathToZip = path.join(__dirname, '..', 'extension.zip');

if (fs.existsSync(pathToZip)) {
  fs.unlinkSync(pathToZip);
}

const output = fs.createWriteStream(pathToZip);

const archive = archiver('zip');

archive.pipe(output);

archive.directory(path.join(__dirname, '..', 'extension'), false);

archive.finalize();
