import { UPLOAD_DIR, URL } from '../environment';

const fs = require('fs');
const PATH = require('path');
const directoryExists = require('directory-exists');

const checkDir = (folderUpload) => new Promise((res, rej) => {
    directoryExists(folderUpload, (err, result) => {
        if (err) rej(err)
        res(result)
    })
})

const mkDir = (folderUpload) => new Promise((res, rej) => {
    fs.mkdir(folderUpload, (err) => {
        if (err) rej(err)
        res(true)
    })
})

const copyFile = (file, path) => {
    let fileName = Date.now() + file.name;

    return new Promise((resolve, reject) => {
        const pathFile = path + '/' + fileName
        fs.copyFile(file.path, pathFile, (err) => {
            console.log(err);
            if (err) reject('UPLOAD.UPLOAD_FAIL')
            console.log('****UPLOAD SUCCESS****');
            resolve({ pathFile, fileName })
        });
    })
}

exports.uploadFile = ({file}) => new Promise(async (res, rej) => {
    let folderUpload = PATH.join(__dirname, '../../' + (UPLOAD_DIR));
    console.log({folderUpload})
    const isExistDir = await checkDir(folderUpload)
    if (!isExistDir) {
        await mkDir(folderUpload)
    }
    let path = PATH.join(__dirname, '../../' , UPLOAD_DIR);
    console.log({path})
    const data = await copyFile(file, path)
    res(data)
})