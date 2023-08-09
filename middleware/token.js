const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 토큰 검증 함수
class TokenMiddleware {
  verifyToken = (token) => {
    try {
      return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      // 토큰이 만료가 된 경우에만 null값
      if (error.message === 'jwt expired') {
        return 'expired';
      }
    }
  };

  // 로그인시 토큰 생성
  generateToken = (id) => {
    // access token
    const accessToken = jwt.sign({ id }, process.env.TOKEN_SECRET, {
      expiresIn: '1m',
    });

    // refresh token
    const refreshToken = jwt.sign({ id }, process.env.TOKEN_SECRET, {
      expiresIn: '3m',
    });

    return { accessToken, refreshToken };
  };

  // 토큰 검증 미들웨어
  checkToken = async (req, res, next) => {
    try {
      const cookie = req.cookies;
      // cookie에 accessToken이 없을 때
      if (!cookie.accessToken) {
        return res
          .status(404)
          .json({ message: 'There is no Token. Please signin your account' });
      }

      let { accessToken } = cookie;
      const checkAccess = this.verifyToken(accessToken);
      const { id } = jwt.decode(accessToken);
      const user = await User.findByPk(id);
      const checkRefresh = this.verifyToken(user.refreshToken);

      if (checkAccess == 'expired') {
        if (checkRefresh === 'expired') {
          // case1: access token과 refresh token 모두만료
          //   const error = new TokenExpired();
          throw new Error();
          return res
            .status(400)
            .json({
              message: 'All tokens are expired. Please re-signin your account',
            });
        } else {
          // case2: access token만 만료
          console.log('accessToken 재발급');
          accessToken = jwt.sign({ id }, process.env.TOKEN_SECRET, {
            expiresIn: '1m',
          });
          res.cookie('accessToken', accessToken);
        }
      } else {
        if (checkRefresh === 'expired') {
          // case3: refresh token만 만료
          console.log('refreshToken 만료 재로그인 필요');
          return res.status(400).json({
            message: 'refreshToken 만료, 다시 로그인해주세요.',
          });
          // TODO: DB에서 업데이트하도록 수정
        }
      }

      // user를 찾을 수 없을 경우
      if (!user) {
        const error = new UserNotFound();
        throw error;
      }
      // 다음 미들웨어로 user 정보 전달
      res.locals.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.clearCookie('accessToken');
      return res.status(400).json({
        message:
          '토큰에 문제가 생겼습니다. 로그인을 통해 토큰을 재발급 받아주세요.',
      });
    }
  };
}

module.exports = TokenMiddleware;
