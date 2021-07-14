import globby from 'globby';
import { uploadFile } from '../../../utils/upload'
import { UPLOAD_DIR } from '../../../environment';

const PATH = require('path');
const thumb = require('node-thumbnail').thumb;
const md5 = require('md5');

const upload = async ({ name, file }) => {
    if (!file) throw new Error('UPLOAD.EMPTY_FILE')
    const { pathFile } = await uploadFile({ name, file })
    return pathFile;
};

const getThumb = async (fileName) => {
    const { file } = await getFile(fileName)
    const thumb_dir = PATH.join(__dirname, '../../../../' + UPLOAD_DIR);
    console.log({ file, thumb_dir })
    return new Promise((res, rej) => {
        thumb({
            source: file,
            destination: thumb_dir,
            basename: md5(fileName),
            suffix: '',
            width: 200,
            skip: true,
            overwrite: false
        }, function (files, err, stdout, stderr) {
            if (err || stderr) {
                throw new Error("UPLOAD.GET_THUMB_FAIL")
            }
            const lastDots = fileName.lastIndexOf('.');
            const typeFile = fileName.substring(lastDots, fileName.length);
            const pathOutFile = PATH.join(thumb_dir, md5(fileName) + typeFile);
            res(pathOutFile);
        });
    })
};

const getFile = async (fileName) => {
    const files = globby.sync(`**/*${fileName}`)
    if (files.length == 0) throw new Error('UPLOAD.FILE_NOT_FOUND')
    console.log({ files })
    return { file: files[0] }
}

module.exports = {
    upload,
    getFile,
    getThumb
};
