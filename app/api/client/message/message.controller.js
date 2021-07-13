import express from 'express';
import { CheckAuthV2 } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import { success } from '../../../utils/response-utils';
import { createMessage, clearNewMessage } from './message.service';

const api = express.Router();

api.post('/message/new', async (req, res) => {
  try {
    const message = await createMessage(req.body);
    return res.json(success(message));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.post('/seen-message', async (req, res) => {
  try {

    const message = await clearNewMessage(req.body);

    return res.json(success(message));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.post('/message/seen', async (req, res) => {
  try {
    console.log({body: req.body})
    await clearNewMessage(req.body);

    return res.json(success({}));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;
