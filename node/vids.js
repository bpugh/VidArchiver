"use strict";

console.log('hello world!');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var vidsdir = 'C:\\Users\\Brandon\\Dropbox\\projects\\vids\\test\\';
var archiveDir = 'C:\\Users\\Brandon\\Dropbox\\projects\\vids\\archive\\';
var errorDir = 'C:\\Users\\Brandon\\Dropbox\\projects\\vids\\error\\';

// var files = fs.readdirSync("C:\\Users\\Brandon\\Dropbox\\projects\\vids");
// files.foreach(function (file) {
//   console.log(file);
// })
var downloadVid = function (url, filePath) {
  var downloaddir = 'C:\\temp\\'
  // url = 'https://www.youtube.com/watch?v=PEePaDqagpc';
  var outputPath = downloaddir + "%(title)s-%(id)s.%(ext)s";
  var yt = spawn('youtube-dl', ["-o", outputPath, url]);
  yt.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });
  yt.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });
  yt.on('close', function (code) {
    var filename = path.basename(filePath);
    if (code == 0) { 
      //success
      fs.renameSync(filePath, archiveDir + filename);
      console.log("success!");
    } else{
      fs.renameSync(filePath, errorDir + filename);
      console.log("failure");
    };
  });
}
// downloadVid();
fs.readdir(vidsdir, function(err,files){
  if(err) throw err;
  if(files.length < 1) console.log('No files found.');
  files.forEach(function(file){
    var filePath = vidsdir + file;
    var ext = path.extname(filePath);
    if(ext === '.txt'){
      fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        console.log(file);
        console.log('data: ' + data);
        downloadVid(data, filePath);
      });
    }
  });
});

// var exec = require('child_process').exec,
//     child;

// child = exec('youtube-dl',
//   function (error, stdout, stderr) {
//     console.log('stdout: ' + stdout);
//     if (error !== null) {
//       console.log('stderr: ' + stderr);
//       console.log('exec error: ' + error);
//     }
// });