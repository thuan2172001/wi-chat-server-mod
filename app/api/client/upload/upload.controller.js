import express from 'express';
import { CheckAuthV2 } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import { success } from '../../../utils/response-utils';
import UploadService from './upload.service';

const multiparty = require('connect-multiparty');
const multipartyMiddleware = multiparty({
    maxFilesSize: 50*1024*1024
});
const api = express.Router();

api.post('/upload', multipartyMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const { file } = req.files;
    const pathFile = await UploadService.upload({ name, file })
    console.log({pathFile})
    return res.json(success({content: pathFile}));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.post('/download/:folder/:fileName', multipartyMiddleware, async (req, res) => {
  try {
    console.log(1)
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.post('/imageOrigin/:folder/:fileName', multipartyMiddleware, async (req, res) => {
  try {
    console.log(2)
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.post('/thumb/:folder/:fileName', multipartyMiddleware, async (req, res) => {
  try {
    console.log(3)
  } catch (err) {
    return CommonError(req, err, res);
  }
});


module.exports = api;

