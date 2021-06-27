import express from 'express';
import path from 'path';
import {
	API_PREFIX,
	MONGODB_DATABASE,
	MONGODB_PASS,
	MONGODB_PORT,
	MONGODB_URL,
	MONGODB_USER,
	NAMESPACE,
	SERVICE_NAME,
	MONGODB_REPLICASET,
	NODE_ENV,
	PORT,
	K8S,
	PROJECT_NAME,
	SERVER_PORT,
} from './environment';
import * as db from './database';
import { seed } from './seed-data/seed';

const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const app = express();
const server = require('http').Server(app);
const fs = require('fs');


module.exports = () => {
	console.log('Bootstrap starting time', new Date());
	let urlConnection = `mongodb://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_URL}:${MONGODB_PORT}/${MONGODB_DATABASE}`;
	console.log(urlConnection);
	const errMes = {};
	if (!fs.existsSync('uploads')) {
		fs.mkdirSync('uploads');
	}
	const dbConnect = () =>
		db
			.connect(urlConnection)
			.then(async (msg) => {
				console.log('MongoDB Url: ', MONGODB_URL);
				return seed()
					.then(() => {
						console.log('Seed success!');
					})
					.catch((e) => {
						console.log('Seed error', e.stack);
						errMes.e = e.stack;
					});
			})
			.catch((err) => {
				console.log(err.message);
				console.log('ERROR DATABASE', err);
				throw err;
			});

	const initApi = () => {
		if (NODE_ENV !== 'production') {
			app.use(morgan('dev'));
		} else app.use(morgan('combined'));
		app.use(cors());
		app.use(bodyParser.json({ limit: '50mb' }));
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(cookieParser());
		app.use(API_PREFIX, require('./api'));
		app.use('/mobile/build', express.static(`${__dirname}/../mobile/build`));
		app.use('/uploads', express.static(`${__dirname}/../uploads`));
		app.use(express.static(`${__dirname}/../deploy/build`));
		app.get('*', (req, res) => {
			res.sendFile(path.join(__dirname, '../deploy/build', 'index.html'));
		});
		app.use((err, req, res, next) => {
			res.json({ error: errMes.e ?? 'DO_YOU_LIKE_SCHOOL?' });
		});
		console.log('Bootstrap ending time', new Date());
	};
	return Promise.all([dbConnect(), initApi()])
		.then((e) => {
			server.setTimeout(7200000);
			server.listen(SERVER_PORT, (err) => {
				if (err) throw err;
				console.log(`${PROJECT_NAME} server is listening on port ${SERVER_PORT}`);
				console.log(new Date());
			});
		})
		.catch((err) => {
			console.log('Something wrong!', err);
			process.exit(1)
		});
};

module.exports.server = server;
