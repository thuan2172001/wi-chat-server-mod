import express from 'express';
import CommonError from '../../library/error';
import { CheckAuth } from '../../middlewares/auth.mid';
import UserService from './user.service';
const User = require('../../../models/user');
const { success, serverError } = require('../../../utils/response-utils');
const { error } = require('../../../services/logger');

const api = express.Router();

api.post('/user', async (req, res) => {
  try {
    const user = await UserService.createUser({ ...req.body });
    return res.json(success({ user }));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log({ username, password })
    const { user, token } = await UserService.credential({
      username,
      password
    })
    return res.json(success({ user, token }))
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
});

api.post('/company/list', CheckAuth, async (req, res) => {
  const companyList = await UserService.getListCompany()
  const body = {
    code: 200,
    content: companyList,
    reason: "Successfully"
  }
  return res.json(success({body}))
})

api.post('/user/list', CheckAuth, async (req, res) => {
  try {
    const userList = await UserService.getListUser()
    const body = {
      code: 200,
      content: userList,
      reason: "Successfully"
    }
    return res.json(success({ body }))
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
})

module.exports = api;
