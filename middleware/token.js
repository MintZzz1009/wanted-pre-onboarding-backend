const jwt = require('jsonwebtoken');
const { User } = require('../models');
const redisClient = require('../redis');

// 토큰 검증 함수
class Token {
  verifyToken = (token) => {
    try {
      return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      // 토큰이 만료가 된 경우
      // if (error.message === 'jwt expired') {
      //   return false;
      // }
      // console.error(error);
      return false;
    }
  };

  // 로그인시 토큰 생성
  generateToken = (id) => {
    // access token
    const accessToken = jwt.sign({ id }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRED,
    });

    // refresh token
    const refreshToken = jwt.sign({ id }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRED,
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
        return res.status(401).json({
          message: '토큰이 존재하지 않습니다. 다시 로그인해주세요.',
        });
      }

      const checkAccess = this.verifyToken(accessToken);
      const { id } = jwt.decode(accessToken);
      const user = await User.findByPk(id);

      // accessToken에 해당하는 user를 찾을 수 없을 경우
      if (!user) {
        return res.status(404).json({
          message:
            '토큰에 해당하는 회원정보를 찾을 수 없습니다. 다시 로그인해주세요.',
        });
      }

      const refreshToken = await redisClient.get(String(id));
      const checkRefresh = this.verifyToken(refreshToken);

      // case1: access token과 refresh token 모두만료
      if (!checkAccess && !checkRefresh) {
        return res.status(401).json({
          message: '토큰이 만료되었습니다. 다시 로그인해주세요.',
        });
      }

      // case2: access token만 만료
      if (!checkAccess && checkRefresh) {
        console.log('accessToken 재발급');
        accessToken = jwt.sign({ id }, process.env.TOKEN_SECRET, {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRED,
        });
        res.cookie('accessToken', accessToken);
      }

      // case3: refresh token만 만료
      if (checkAccess && !checkRefresh) {
        console.log('refreshToken 만료');
        res.clearCookie('accessToken');
        return res.status(401).json({
          message: 'refreshToken 만료, 다시 로그인해주세요.',
        });
      }

      res.locals.user = user;
      next();
      return;
    } catch (error) {
      console.error(error);
      res.clearCookie('accessToken');
      return res.status(401).json({
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
      const { id } = jwt.decode(accessToken);
      res.locals.user = id;
      next();
    } catch (error) {
      console.error(error);
      res.clearCookie('accessToken');
      return res.status(401).json({
        message: '토큰에 문제가 생겨 로그아웃되었습니다',
      });
    }
  };
}

module.exports = Token;
