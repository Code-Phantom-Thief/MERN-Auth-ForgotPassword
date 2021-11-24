const nodemailer = require('nodemailer');

const EMAIL_SERVICE = process.env.EMAIL_SERVICE;
const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM;

const sendEmail = (options) => {
	const transporter = nodemailer.createTransport({
		service: EMAIL_SERVICE,
		auth: {
			user: EMAIL_USERNAME,
			pass: EMAIL_PASSWORD,
		},
	});

	const mailOptions = {
		from: EMAIL_FROM,
		to: options.to,
		subject: options.subject,
		html: options.text,
	};
	transporter.sendMail(mailOptions, function (err, info) {
		if (err) {
			console.error(err);
		} else {
			console.log(info);
		}
	});
};

module.exports = sendEmail;
