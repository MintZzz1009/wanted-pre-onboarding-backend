const AuthService = require('../services/auth.service');

class AuthController {
  authService = new AuthService();

  // 회원가입
  signUp = async (req, res) => {};

  // 로그인
  signIn = async (req, res) => {};

  // 로그아웃
  signOut = async (req, res) => {};
}

module.exports = AuthController;
