const fs = require('fs-extra');

exports.isExistFile = async (file) => new Promise((resolve, reject) => {
  fs.access(file, fs.constants.F_OK, (error) => {
    if (error) return resolve(false);

    resolve(true);
  });
});

exports.readFile = async (file) => new Promise((resolve, reject) => {
  fs.readFile(file, 'utf8', (error, data) => {
    if (error) return reject(error);
    resolve(data);
  });
});

exports.appendFile = async (pathFile, data) => new Promise((resolve, reject) => {
  fs.appendFile(pathFile, data, (error) => {
    if (error) return reject(error);

    return resolve(true);
  });
});

exports.writeFile = async (pathFile, data) => new Promise((resolve, reject) => {
  fs.writeFile(pathFile, data, (error) => {
    if (error) return reject(error);

    return resolve(true);
  });
});

exports.deleteFirstLine = async (pathFile) => new Promise((resolve, reject) => {
  fs.readFile(pathFile, 'utf8', (error, data) => {
    if (error) return reject(error);
    const linesExceptFirst = data.split('\n').slice(1).join('\n');
    fs.writeFile(pathFile, linesExceptFirst, (error) => {
      if (error) return reject(error);

      return resolve(true);
    });
  });
});

exports.unlinkFile = async (pathFile) => new Promise((resolve, reject) => {
  fs.unlink(pathFile, (error) => {
    if (error) return reject(error);

    resolve(true);
  });
});

exports.streamToBuffer = (stream) => new Promise((res, rej) => {
    let bufs = [];
    stream.on('data', (d) => bufs.push(d));
    stream.on('end', () => {
      console.log('load buffer success');
      res(Buffer.concat(bufs));
    });
    stream.on('error', (err) => rej(err));
  });

