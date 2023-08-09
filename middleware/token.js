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
      expiresIn: '2h',
    });

    // refresh token
    const refreshToken = jwt.sign({ id }, process.env.TOKEN_SECRET, {
      expiresIn: '14d',
    });

    return { accessToken, refreshToken };
  };

  // 토큰 검증 미들웨어
  checkToken = async (req, res, next) => {
    try {
      const cookie = req.cookies;

      // cookie 없거나, cookie 있어도 token이 없을때
      if (!cookie || !cookie.accessToken) {
        // return res.redirect('/auth/signin'); // 로그인 페이지로 이동
        return { message: 'There is no Token. Please signin your account' };
      }

      let { accessToken, refreshToken } = cookie;

      const checkAccess = this.verifyToken(accessToken);
      const checkRefresh = this.verifyToken(refreshToken);

      if (checkAccess == 'expired') {
        if (checkRefresh === 'expired') {
          // case1: access token과 refresh token 모두만료
          const error = new TokenExpired();
          throw error;
        } else {
          // case2: access token만 만료
          let { id } = checkRefresh;
          accessToken = jwt.sign({ id }, process.env.TOKEN_SECRET, {
            expiresIn: '2h',
          });
          res.cookie('accessToken', accessToken);
        }
      } else {
        if (checkRefresh === 'expired') {
          // case3: refresh token만 만료
          let { id } = checkAccess;
          refreshToken = jwt.sign({ id }, process.env.TOKEN_SECRET, {
            expiresIn: '14d',
          });
          res.cookie('refreshToken', refreshToken);
        }
      }
      console.log(33, jwt.verify(accessToken, process.env.TOKEN_SECRET));
      let { userId } = this.verifyToken(accessToken);
      const user = await User.findByPk(userId);

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
      res.clearCookie('refreshToken');
      return res.status(400).json({
        message:
          '토큰에 문제가 생겼습니다. 로그인을 통해 토큰을 재발급 받아주세요.',
      });
    }
  };
}

module.exports = TokenMiddleware;
