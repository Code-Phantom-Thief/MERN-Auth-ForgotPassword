const mongoose = require('mongoose');
const crypto = require('crypto');

const { compare, hash, genSalt } = require('bcrypt');
const { sign, verify } = require('jsonwebtoken');

const { JWT_SECRET, JWT_EXPIRE } = process.env;

const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		username: {
			type: String,
			required: [true, 'Username is required'],
			trim: true,
			maxlength: 50,
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			trim: true,
			maxlength: 200,
			unique: true,
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				'Please provide a valid email',
			],
		},
		password: {
			type: String,
			required: [true, 'Please add a password'],
			minlength: 6,
			select: false,
		},
		resetPasswordToken: String,
		resetPasswordExpire: Date,
	},
	{ timestamps: true }
);

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	try {
		this.password = await hash(this.password, 12);
		next();
	} catch (error) {
		console.error(error);
		next(error);
	}
});

UserSchema.methods = {
	comparePassword: async function (enteredPassword) {
		try {
			return await compare(enteredPassword, this.password);
		} catch (error) {
			console.error(error);
			return;
		}
	},
	getSignedToken: function () {
		return sign({ id: this._id }, JWT_SECRET, {
			expiresIn: JWT_EXPIRE,
		});
	},
	getResetPasswordToken: function () {
		const resetToken = crypto
			.randomBytes(20)
			.toString('hex');

		// Hash token (private key) and save to database
		this.resetPasswordToken = crypto
			.createHash('sha256')
			.update(resetToken)
			.digest('hex');

		// Set token expire date
		this.resetPasswordExpire =
			Date.now() + 10 * (60 * 1000); // Ten Minutes

		return resetToken;
	},
};

module.exports = mongoose.model('User', UserSchema);
