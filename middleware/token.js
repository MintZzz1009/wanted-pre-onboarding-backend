const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 토큰 검증 함수
class Token {
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
      expiresIn: '1h',
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
      let { accessToken } = cookie;

      // cookie에 accessToken이 없을 때
      if (!accessToken) {
        return res
          .status(404)
          .json({ message: 'There is no Token. Please signin your account' });
      }

      const checkAccess = this.verifyToken(accessToken);
      const { id } = jwt.decode(accessToken);
      const user = await User.findByPk(id);
      const checkRefresh = this.verifyToken(user.refreshToken);

      if (checkAccess == 'expired') {
        if (checkRefresh === 'expired') {
          // case1: access token과 refresh token 모두만료
          return res.status(400).json({
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

  // 로그아웃을 위한 단순 user정보 파악
  whoIsUser = async (req, res, next) => {
    try {
      const cookie = req.cookies;
      let { accessToken } = cookie;

      if (!accessToken) {
        throw new Error();
      }

      const { id } = jwt.decode(accessToken);

      res.locals.user = id;
      next();
    } catch (error) {
      console.error(error);
      res.clearCookie('accessToken');
      return res.status(400).json({
        message: '로그아웃되었습니다',
      });
    }
  };
}

module.exports = Token;
