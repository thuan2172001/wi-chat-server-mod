import { createRandomColor } from '../../utils/random-color';

const jwt = require('jsonwebtoken');
const { unauthorized, badRequest } = require('../../utils/response-utils');
const User = require('../../models/user');

function findUserByUsername(username) {
	return new Promise((resolve, reject) => {
		User.findOne({ username }, (err, userInDB) => {
			if (err) reject(err);
			resolve(userInDB);
		});
	});
}

export const CheckAuth = async (req, res, next) => {
	try {
		const authString = req.body?.token || req.query?.token || req.headers?.authorization;
		if (!authString || authString === '') {
			if (ByPassAuth(req, res, next)) return;
			res.json(unauthorized('AUTH.ERROR.NOT_LOGGED_IN'));
			return;
		}
		const isVerify = new Promise((resolve, reject) => {
			jwt.verify(authString, 'secretKey', function (err, decoded) {
				const userInfo = decoded?.user;
				console.log({ decode })
				if (userInfo) {
					req['userInfo'] = userInfo;
					resolve(next())
				}
			})
		})
		return isVerify
	} catch (e) {
		console.log(e.message);
		res.json(unauthorized('AUTH.ERROR.INTERNAL_ERROR'));
	}
}