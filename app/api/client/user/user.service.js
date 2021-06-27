import User from '../../../models/user';
import Role from '../../../models/role';
import { createRandomColor } from '../../../utils/random-color'
import { success, serverError } from '../../../utils/response-utils';
const { axios } = require('axios');
const jwt = require('jsonwebtoken');

const createUser = async ({
  username,
  role,
  password,
}) => {
  const userInDb = await User.findOne({ username });

  if (userInDb) throw new Error('USER.POST.USER_EXISTED');

  const roleType = await Role.findOne({ role });

  const user = new User({
    username,
    role: roleType._id,
    password,
    color: createRandomColor(),
  });
  return user.save();

};

const credential = async ({
  username,
  password,
}) => {
  if (!username) {
    throw new Error('AUTH.ERROR.NULL_USERNAME');
  } else {
    const user = await User.findOne({ username, password }).lean();
    if (!user) throw new Error('AUTH.ERROR.USER_NOT_FOUND');
    const token = jwt.sign({ user }, 'secretKey')
    return { user, token }
  }
}

const getListCompany = async (req, res) => {
  // return axios({
  //   method: 'post',
  //   url: `http://admin.dev.i2g.cloud/company/list`,
  //   data: {
  //     ...req.body,
  //   },
  // }).then(data => {
  //   return res.json(success(data))
  // }).catch(err => {
  //   return res.json(serverError(err.message));
  // });
  console.log(2)
}

const getListUser = async () => {
  const userList = await User.find({})
  return userList
  // return axios({
  //   method: 'post',
  //   url: `http://admin.dev.i2g.cloud/user/list`,
  //   data: {
  //     ...req.body,
  //   },
  // }).then(data => {
  //   return res.json(success(data))
  // }).catch(err => {
  //   return res.json(serverError(err.message));
  // });
}

module.exports = {
  createUser,
  credential,
  getListUser,
  getListCompany,
};
