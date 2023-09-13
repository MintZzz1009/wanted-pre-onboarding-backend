const AuthService = require('../services/auth.service');
const redisClient = require('../redis');

class AuthController {
  authService = new AuthService();

  // 회원가입
  signUp = async (req, res) => {
    try {
      const { email, hashedPassword } = res.locals.user;
      console.log('signUp controller', email, hashedPassword);
      await this.authService.signUp(email, hashedPassword);
      return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
    } catch (error) {
      throw error;
    }
  };

  // 로그인
  signIn = async (req, res) => {
    try {
      const { email } = res.locals.user;
      const accessToken = await this.authService.signIn(email);
      res.cookie('accessToken', accessToken);
      return res.status(200).json({ message: '로그인이 완료되었습니다.' });
    } catch (error) {
      throw error;
    }
  };

  // 로그아웃
  signOut = async (req, res) => {
    try {
      const id = res.locals.user;
      res.clearCookie('accessToken');
      console.log(req.headers.cookie);
      await this.authService.clearRefreshToken(id);
      return res.status(204).json();
    } catch (error) {
      throw error;
    }
  };
}

module.exports = AuthController;
