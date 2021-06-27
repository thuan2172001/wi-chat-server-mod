import express from 'express';
import CommonError from '../../library/error';
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

api.post('/company/list', async (req, res) => {
  return UserService.getListCompany(req, res)
})

api.post('/user/list', async (req, res) => {
  try {
    const userList = await UserService.getListUser()
    return res.json(success({ userList }))
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
})

module.exports = api;
