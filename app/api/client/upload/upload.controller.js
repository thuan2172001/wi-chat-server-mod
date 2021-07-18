import express from 'express';
import { CheckAuth, CheckAuthV2 } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import { success } from '../../../utils/response-utils';
import UploadService from './upload.service';

const multiparty = require('connect-multiparty');
const multipartyMiddleware = multiparty({
  maxFilesSize: 50 * 1024 * 1024
});
const api = express.Router();

api.post('/upload', multipartyMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const { file } = req.files;
    const pathFile = await UploadService.upload({ name, file })
    console.log({ pathFile })
    return res.json(success({ content: pathFile }));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get('/download/:fileName', CheckAuth, async (req, res) => {
  try {
    const { fileName } = req.params;
    const { file } = await UploadService.getFile(fileName)
    // console.log({ file })
    res.download(file);
  } catch (err) {
    console.log({ stack: err.stack })
    return CommonError(req, err, res);
  }
});

api.get('/imageOrigin/:fileName', CheckAuth, async (req, res) => {
  try {
    const { folder, fileName } = req.params;
    const { file } = await UploadService.getFile(fileName)
    console.log({ file })
    res.sendFile('/app/' + file);
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get('/thumb/:fileName', CheckAuth, async (req, res) => {
  try {
    const { fileName } = req.params;
    const { file } = await UploadService.getFile(fileName)
    // const pathOutFile = await UploadService.getThumb(fileName);
    console.log({ file })
    res.sendFile('/app/' + file)
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;

