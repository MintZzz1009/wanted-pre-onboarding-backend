const AuthService = require('../services/auth.service');

class AuthController {
  authService = new AuthService();

  // 회원가입
  signUp = async (req, res) => {
    try {
      console.log(req.body);
      const { email, password } = req.body;
      return await this.authService.signUp(email, password);
    } catch (error) {
      throw error;
    }
  };

  // 로그인
  signIn = async (req, res) => {};

  // 로그아웃
  signOut = async (req, res) => {};
}

module.exports = AuthController;
