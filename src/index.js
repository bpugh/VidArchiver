const fs = require('fs')
const chokidar = require('chokidar')
const path = require('path')
const spawn = require('child_process').spawn
const rc = require('rc')
const appName = 'vidArchiver'
const config = rc(appName, {})
console.log(config)

const watcher = chokidar.watch(config.vidsdir, {
  ignored: /[\/\\]\./,
  persistent: true,
})
watcher
  .on('add', newpath => {
    console.log(`File ${newpath} has been added`)
    readFile(newpath)
  })

function readFile(file) {
  const filePath = path.isAbsolute(file) ? file : config.vidsdir + file
  const ext = path.extname(filePath)
  if (ext === '.txt') {
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err2, data) {
      console.log(file)
      console.log('data: ' + data)
      downloadVid(data, filePath)
    })
  }
}

function downloadVid(url, filePath) {
  const outputPath = config.downloadDir + '%(title)s.%(ext)s'
  const yt = spawn('youtube-dl', ['-o', outputPath, url])
  yt.stdout.on('data', function(data) {
    console.log('stdout: ' + data)
  })
  yt.stderr.on('data', function(data) {
    console.error('stderr: ' + data)
  })
  yt.on('close', function(code) {
    const filename = path.basename(filePath)
    if (code === 0) { // success
      fs.renameSync(filePath, config.archiveDir + filename)
      console.log(`${filename} successfully archived`)
    } else { // error
      fs.renameSync(filePath, config.errorDir + filename)
      console.error(`Error archiving ${filename}`)
    }
  })
}
