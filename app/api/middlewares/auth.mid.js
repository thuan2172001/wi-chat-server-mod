import { createRandomColor } from '../../utils/random-color';
const User = require('../../models/user');

function findUserByUsername(username) {
	return new Promise((resolve, reject) => {
		User.findOne({ username }, (err, userInDB) => {
			if (err) reject(err);
			resolve(userInDB);
		});
	});
}

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
