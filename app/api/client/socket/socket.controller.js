import express from 'express';
import { CheckAuth } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import { success } from '../../../utils/response-utils';
import { io } from '../../../socket.io/socket.io'

const api = express.Router();

api.get('/monitor', async (req, res) => {
  try {
    return res.json(success(io));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;
