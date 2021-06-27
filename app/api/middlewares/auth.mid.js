import {
	API_PREFIX,
	CHECK_AUTH,
	CHECK_CHANGE_PASSWORD,
	CHECK_REQUEST_SIGNATURE,
} from '../../environment';
import { SYMETRIC_SECRET } from '../../environment';
import { createRandomColor } from '../../utils/random-color';

const { unauthorized, badRequest } = require('../../utils/response-utils');
const { VerifyMessage, SymmetricDecrypt } = require('../../utils/crypto-utils');
const User = require('../../models/user');

function findUserByUsername(username) {
	return new Promise((resolve, reject) => {
		User.findOne({ username }, (err, userInDB) => {
			if (err) reject(err);
			resolve(userInDB);
		});
	});
}

const ByPassAuth = (req, res, next) => {
	if (!CHECK_AUTH || CHECK_AUTH === 'false') {
		const username = req.query.fakeUsername
			? req.query.fakeUsername
			: 'superadmin';
		findUserByUsername(username).then((userInfo) => {
			req.userInfo = userInfo;
			next();
		});
		return true;
	}
	return false;
};

export const CheckAuth = async (req, res, next) => {
	try {
		const authString = req.headers.authorization;
		if (!authString || authString === '') {
			if (ByPassAuth(req, res, next)) return;
			res.json(unauthorized('AUTH.ERROR.NOT_LOGGED_IN'));
			return;
		}
		const authInfo = JSON.parse(authString);
		const {
			certificateInfo: { emailSignature, googleSignature },
		} = authInfo;

		const unexpired = () => {
			const expiredTime = new Date(authInfo.certificateInfo.timestamp);
			expiredTime.setSeconds(
				expiredTime.getSeconds() + authInfo.certificateInfo.exp
			);
			return new Date() < expiredTime;
		};
		if (!unexpired()) {
			if (ByPassAuth(req, res, next)) return;
			res.json(unauthorized('AUTH.ERROR.EXPIRED'));
			return;
		}
		const isValid = VerifyMessage(
			authInfo.signature,
			authInfo.certificateInfo,
			authInfo.publicKey
		);
		if (!isValid) {
			if (ByPassAuth(req, res, next)) return;
			res.json(unauthorized('AUTH.ERROR.INVALID'));
			return;
		}
		findUserByUsername(authInfo.certificateInfo.username).then((userInfo) => {
			if (!userInfo) {
				if (ByPassAuth(req, res, next)) return;

				return res.json(unauthorized('AUTH.ERROR.USERNAME_NOTFOUND'));
			}

			if (userInfo.publicKey !== authInfo.publicKey) {
				if (ByPassAuth(req, res, next)) return;

				return res.json(unauthorized('AUTH.ERROR.MISMATCH_PUBLIC_KEY'));
			}

			const isSetTempPassword =
				req.originalUrl === `${API_PREFIX}/auth/temp-password`;
			const isChangePassword =
				req.originalUrl === `${API_PREFIX}/auth/password`;
			if (
				(CHECK_CHANGE_PASSWORD === 'true' || CHECK_CHANGE_PASSWORD === true) &&
				userInfo.publicKey === userInfo.issuedPublicKey &&
				!isSetTempPassword &&
				!isChangePassword
			) {
				if (ByPassAuth(req, res, next)) return;
				return res.json(unauthorized('AUTH.ERROR.NEED_TO_CHANGE_PASSWORD'));
			}
			if (CHECK_REQUEST_SIGNATURE === 'true') {
				if (req.method !== 'GET') {
					const { _signature, _actionType, _timestamp } = req.body;
					const GetActionModule = (_url) => {
						return _url.replaceAll('/', '-').substring(1);
					};
					const realMethod = req.method.toLowerCase();
					const getActionType = () => {
						return (
							realMethod +
							'_' +
							GetActionModule(req.originalUrl ?? '')
						).toUpperCase();
					};
					if (typeof _actionType !== 'string' || _actionType.length === 0) {
						return res.json(badRequest('AUTH.ERROR.ACTION_TYPE_INVALID'));
					}
					if (_actionType !== getActionType()) {
						return res.json(badRequest('AUTH.ERROR.ACTION_TYPE_MISMATCH'));
					}
					if (!_signature) {
						return res.json(unauthorized('AUTH.ERROR.SIGNATURE_BODY_MISSING'));
					}
					if (!_timestamp) {
						return res.json(unauthorized('AUTH.ERROR.TIMESTAMP_MISSING'));
					}
					const checkExpiredTime = () => {
						const expiredTime = new Date(_timestamp);
						expiredTime.setSeconds(expiredTime.getSeconds() + 600);
						return new Date() < expiredTime;
					};
					if (!checkExpiredTime()) {
						return res.json(unauthorized('AUTH.ERROR.REQUEST_EXPIRED'));
					}
					if (
						!VerifyMessage(
							_signature,
							{
								...req.body,
								_signature: undefined,
							},
							authInfo.publicKey
						)
					)
						return res.json(unauthorized('AUTH.ERROR.SIGNATURE_BODY_MISMATCH'));
				}
			}
			req.userInfo = userInfo;
			return next();
		});
	} catch (e) {
		console.log(e.message);
		res.json(unauthorized('AUTH.ERROR.INTERNAL_ERROR'));
	}
};

export const CheckAuthV2 = async (req, res, next) => {
	if (req.originalUrl == '/login') {
		next();
	} else {
		let token = req.body.token || req.query.token || req.headers.authorization;
		if (token) {
			jwt.verify(token, 'secretKey', function (err, decoded) {
				req.decode = decoded;
				if (err) {
					console.error(err);
					return res.status(401).send(responseJSON(401, 'Failed to authenticate' + err));
				} else {
					User.findOne({
						username: decoded.username
					}).then((user) => {
						if (user) {
							req.decoded = JSON.parse(user);
							next();
						} else {
							User.create({
								username: decoded.username,
								password: '123456',
								role: decoded.role,
								color: createRandomColor()
							}).then(user => {
								req.decoded = JSON.parse(user);
								next();
							}).catch(err => {
								return res.status(401).send(responseJSON(401, 'Failed to authenticate' + err));
							});
						}
					});
				}
			});
		} else {
			return res.status(401).send(responseJSON(401, 'No token provided'));
		}
	}
}
