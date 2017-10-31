var fs = require('fs')
var path = require('path')

const maxNumberOfFiles = 20;
const maxFileSize = 2 * 1000000.0;

export default function logToFile(req, res, next) {
    var appDir = path.dirname(require.main.filename);
    var logDirectory = path.join(appDir, 'logs')
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
    var parentPath = logDirectory + '/';
    // var d = new Date()
    // var fileName = parentPath + "access_" + d.getFullYear() + "_" + (d.getMonth() + 1) + "_" + d.getDate() + ".log";
    getCurrentFileName(parentPath)
        .then((fileName) => {
            let writeStr = generateLogStr(req);
            if (isFileSizeLessThanInMB(fileName, maxFileSize)) {
                fs.appendFile(fileName, writeStr, function (err) {
                    if (err) console.log(err);
                });
            } else {
                createNewFile(parentPath)
                    .then((newFileName) => {
                        fs.appendFile(newFileName, writeStr, function (err) {
                            if (err) console.log(err);                            
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        })
        .catch((err) => {
            console.log(err);
        });
    next();
}

const generateLogStr = (req) => {
    const method = "method - " + req.method + '\t';
    const url = "url - " + req.url + '\t';
    const clientIP = "client ip - " + req.connection.remoteAddress + '\t';
    const userType = req.session ? req.session.passport ? req.session.passport.user : "anonymous" : "anonymous";
    const user = "user - " + userType + '\t';
    const timestamp = "time - " + Date.now() + '\t';

    return method + url + clientIP + user + timestamp + "\n";
}

const deleteOldLogFile = (dir, num = 10) => {
    fs.readdir(dir, (err, files) => {
        if (files.length > num) {
            files.sort(function (a, b) {
                return fs.statSync(dir + a).ctime.getTime() - fs.statSync(dir + b).ctime.getTime();
            });
            const exFilePath = dir + "/" + files[0];
            fs.unlink(exFilePath, () => {
                console.log("oldest log file " + exFilePath + "deleted");
            })
        }
    });
}

const getFilesizeInBytes = (filename) => {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats.size
    return fileSizeInBytes
}

const isFileSizeLessThanInMB = (fileName, umb = 1) => {
    const fileSize = getFilesizeInBytes(fileName);
    if (fileSize < umb) {
        return true;
    } else {
        return false;
    }
}

const getCurrentFileName = (dir) => {
    return new Promise(
        (resolve, reject) => {
            fs.readdir(dir, (err, files) => {
                let currentFileName;
                if(err) reject(err);
                if(files.length > 0){
                    files.sort(function (b, a) {
                        return fs.statSync(dir + a).ctime.getTime() - fs.statSync(dir + b).ctime.getTime();
                    });
                    currentFileName = dir + files[0];
                    resolve(currentFileName);
                }else{
                    createNewFile(dir).then((newFileName) => {
                        resolve(newFileName)
                    })
                }
            });
        }
    )
}

const createNewFile = (dir) => {
    return new Promise(
        (resolve, reject) => {
            const fileName = dir + "access" + Date.now() + ".log"
            fs.appendFile(fileName, "", function (err) {
                if(err) reject(err)
                deleteOldLogFile(dir, maxNumberOfFiles);
                resolve(fileName)
            });
        }
    )
}