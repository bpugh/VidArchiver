const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;
const vidsdir = 'C:\\Users\\Brandon\\Dropbox\\projects\\vids\\test\\';
const archiveDir = 'C:\\Users\\Brandon\\Dropbox\\projects\\vids\\archive\\';
const errorDir = 'C:\\Users\\Brandon\\Dropbox\\projects\\vids\\error\\';

// const files = fs.readdirSync('C:\\Users\\Brandon\\Dropbox\\projects\\vids');
// files.foreach(function(file) {
//   console.log(file);
// });

// todo: use sync version for simplicity
fs.readdir(vidsdir, function(err, files) {
  if (err) throw err;
  if (files.length < 1) console.log('No files found.');
  files.forEach(function(file) {
    const filePath = vidsdir + file;
    const ext = path.extname(filePath);
    if (ext === '.txt') {
      fs.readFile(filePath, {encoding: 'utf-8'}, function(err2, data) {
        console.log(file);
        console.log('data: ' + data);
        downloadVid(data, filePath);
      });
    }
  });
});

function downloadVid(url, filePath) {
  const downloaddir = 'C:\\temp\\';
  const outputPath = downloaddir + '%(title)s.%(ext)s';
  const yt = spawn('youtube-dl', ['-o', outputPath, url]);
  yt.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
  });
  yt.stderr.on('data', function(data) {
    console.error('stderr: ' + data);
  });
  yt.on('close', function(code) {
    const filename = path.basename(filePath);
    if (code === 0) { // success
      fs.renameSync(filePath, archiveDir + filename);
      console.log(`${filename} successfully archived`);
    } else { // error
      fs.renameSync(filePath, errorDir + filename);
      console.error(`Error archiving ${filename}`);
    }
  });
}
