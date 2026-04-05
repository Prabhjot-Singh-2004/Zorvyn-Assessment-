const express = require('express');
const router = express.Router();
const { login, signup } = require('../controllers/authController');
const { validate, loginSchema, signupSchema } = require('../middlewares/validation');

router.post('/login', validate(loginSchema), login);
router.post('/signup', validate(signupSchema), signup);

module.exports = router;
