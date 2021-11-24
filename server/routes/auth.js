const router = require('express').Router();
const {
	login,
	register,
	resetpassword,
	forgotpassword,
} = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotpassword);
router.put('/resetpassword/:resetToken', resetpassword);

module.exports = router;