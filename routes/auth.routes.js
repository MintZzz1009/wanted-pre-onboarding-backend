const express = require('express');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();
const authController = new AuthController();

router.post('/signup', authController.signup); // 추후 validation 미들웨어 추가
router.post('/signin', authController.signin); // 추후 validation 미들웨어 추가
router.post('/signout', authController.signout);

module.exports = router;
