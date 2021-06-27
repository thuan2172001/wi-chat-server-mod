import { getNextSequence } from '../api/library/getNextCounter';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
	{
		code: {
			type: String,
			required: true,
			unique: true,
		},
		username: {
			type: String,
			required: true
		},
		role: {
			type: Schema.Types.ObjectId,
			ref: 'Role',
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		color: {
			type: String,
			require: true,
		},
	},
	{ timestamps: true }
);

UserSchema.pre('validate', async function () {
	if (!this.code) {
		const nextSeq = await getNextSequence('users');
		this.code = nextSeq;
	}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
