const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

exports.register = async (req, res, next) => {
	const { username, email, password } = req.body;
	try {
		const existUser = await User.findOne({ email });
		if (existUser) {
			return res.status(400).json({
				message:
					'You are already this sites member. Please login',
			});
		}

		const user = new User({ username, email, password });
		await user.save();

		sendToken(user, 201, res);
	} catch (error) {
		next(error);
	}
};

exports.login = async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(
			new ErrorResponse(
				'Please provide an email and password',
				400
			)
		);
	}
	try {
		const user = await User.findOne({ email }).select(
			'password'
		);
		if (!user) {
			return next(
				new ErrorResponse('Invalid Credentials', 401)
			);
		}
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return next(
				new ErrorResponse('Invalid Credentials', 401)
			);
		}

		sendToken(user, 200, res);
	} catch (error) {
		next(error);
	}
};

exports.forgotpassword = async (req, res, next) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return next(
				new ErrorResponse('Email could not be sent', 404)
			);
		}

		const resetToken = user.getResetPasswordToken();
		await user.save();

		const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;
		const message = `
		<h1>You have requested a password reset </h1>
		<p>Please go to this link to reset your password </p>
		<a href=${resetUrl} clicktracking=off>${resetUrl}</a>
		`;

		try {
			await sendEmail({
				to: user.email,
				subject: 'Password Reset Request',
				text: message,
			});

			return res
				.status(200)
				.json({ success: true, data: 'Email sent' });
		} catch (error) {
			console.log(error);
			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;

			await user.save();
			return next(
				new ErrorResponse('Email could not be send', 500)
			);
		}
	} catch (error) {
		next(error);
	}
};

exports.resetpassword = async (req, res, next) => {
	const { password } = req.body;
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.resetToken)
		.digest('hex');
	try {
		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() },
		});

		if (!user) {
			return next(
				new ErrorResponse('Invalid Reset Token', 400)
			);
		}

		user.password = password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save();
		return res
			.status(201)
			.json({
				sucess: true,
				data: 'Password reset successfully',
			});
	} catch (error) {
		next(error);
	}
};

const sendToken = (user, statusCode, res) => {
	const token = user.getSignedToken();
	res.status(statusCode).json({ success: true, token });
};
