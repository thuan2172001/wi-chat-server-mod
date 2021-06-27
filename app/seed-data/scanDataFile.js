const globby = require('globby');
const path = require('path');
const { readFile } = require('../utils/file-utils');

exports.getCSVFiles = async (fileName) => {
  const dir = path.join(__dirname, 'data');

  return globby(`${dir}/*${fileName}.csv`);
};

exports.getContentCSVFiles = async (file, deli = ',') => {
  let lines = await readFile(file);

  lines = lines.split('\n');
  return {
    header: lines[0].split(deli).map((item) => item.replace(/(\r\n|\n|\r)/gm, '')),
    content: lines.slice(1),
  };
};

exports.cleanField = (field) => field.map((item) => item.replace(/(\r\n|\n|\r)/gm, ''));


exports.parseList = (field) => {
  return JSON.parse(`${field.replaceAll('\'', '"')}`)
}