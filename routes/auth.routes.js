const express = require('express');
const AuthController = require('../controllers/auth.controller');
const Token = require('../middleware/token');
const Validator = require('../middleware/validator');

const router = express.Router();
const authController = new AuthController();
const token = new Token();
const validator = new Validator();

router.post(
  '/signup',
  validator.isValid,
  validator.isNew,
  authController.signUp
);
router.post(
  '/signin',
  validator.isValid,
  validator.compareUserInfo,
  authController.signIn
);
router.post('/signout', token.whoIsUser, authController.signOut);

module.exports = router;
