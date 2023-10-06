const AuthService = require('../services/auth.service');
const asyncErrorCatcher = require('../utils/asyncErrorCatcher');
const redisClient = require('../utils/redis');
const {
  StatusCodes: { OK, CREATED, NO_CONTENT, NOT_FOUND },
} = require('http-status-codes');

class AuthController {
  authService = new AuthService();

  // 회원가입
  signUp = asyncErrorCatcher(async (req, res) => {
    const { email, hashedPassword } = res.locals.user;
    await this.authService.signUp(email, hashedPassword);
    return res.status(CREATED).json({ message: '회원가입이 완료되었습니다.' });
  });

  // 로그인
  signIn = asyncErrorCatcher(async (req, res) => {
    const { email } = res.locals.user;
    const accessToken = await this.authService.signIn(email);
    res.cookie('accessToken', accessToken);
    return res.status(OK).json({ message: '로그인이 완료되었습니다.' });
  });

  // 로그아웃
  signOut = asyncErrorCatcher(async (req, res) => {
    const id = res.locals.user;
    res.clearCookie('accessToken');
    const deleteRefreshToken = await this.authService.clearRefreshToken(id);
    if (deleteRefreshToken === 'success') {
      return res.status(NO_CONTENT).json();
    } else {
      return res.status(NOT_FOUND).json(deleteRefreshToken);
    }
    // 두 경우 모두 로그아웃이지만 응답내용은 다르도록.
  });
}

module.exports = AuthController;
