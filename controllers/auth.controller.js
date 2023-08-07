const AuthService = require('../services/auth.service');

class AuthController {
  authService = new AuthService();

  // 회원가입
  signUp = async (req, res) => {
    try {
      const { email, password } = req.body;
      const signUp = await this.authService.signUp(email, password);
      return res.status(201).json(signUp);
    } catch (error) {
      throw error;
    }
  };

  // 로그인
  signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
      const signIn = await this.authService.signIn(email, password);
      return res.status(200).json(signIn);
    } catch (error) {
      throw error;
    }
  };

  // 로그아웃
  signOut = async (req, res) => {};
}

module.exports = AuthController;
