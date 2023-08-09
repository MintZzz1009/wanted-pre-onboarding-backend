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
      const accessToken = await this.authService.signIn(email, password);
      res.cookie('accessToken', accessToken);
      return res.status(200).json({ message: '로그인이 완료되었습니다.' });
    } catch (error) {
      throw error;
    }
  };

  // 로그아웃
  signOut = async (req, res) => {
    res.clearCookie('accessToken');
    await this.authService.clearRefreshToken(id);
    return res.status(200).json({ message: '로그아웃이 완료되었습니다.' });
  };
}

module.exports = AuthController;
