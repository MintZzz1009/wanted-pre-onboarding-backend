const jwt = require('jsonwebtoken');
const { User } = require('../models');
const redisClient = require('../utils/redis');
const asyncErrorCatcher = require('../utils/asyncErrorCatcher');
const { TokenServiceError } = require('../utils/apiError');
const {
  StatusCodes: { UNAUTHORIZED },
} = require('http-status-codes');
const { TOKEN_SECRET, ACCESS_TOKEN_EXPIRED, REFRESH_TOKEN_EXPIRED } =
  process.env;

// 토큰 검증 함수
class Token {
  verifyToken = (token) => {
    try {
      return jwt.verify(token, TOKEN_SECRET);
    } catch (error) {
      return false;
    }
  };

  // 로그인시 토큰 생성
  generateToken = (id) => {
    // access token
    const accessToken = jwt.sign({ id }, TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRED,
    });

    // refresh token
    const refreshToken = jwt.sign({ id }, TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRED,
    });

    return { accessToken, refreshToken };
  };

  // 토큰 검증 미들웨어
  checkToken = asyncErrorCatcher(async (req, res, next) => {
    const cookie = req.cookies;
    let { accessToken } = cookie;

    // cookie에 accessToken이 없을 때
    if (!accessToken) {
      throw new TokenServiceError(
        UNAUTHORIZED,
        '토큰이 존재하지 않습니다. 다시 로그인해주세요.'
      );
    }

    const checkAccess = this.verifyToken(accessToken);
    const { id } = jwt.decode(accessToken);
    const user = await User.findByPk(id);

    if (!user) {
      throw new TokenServiceError(
        NOT_FOUND,
        '토큰에 해당하는 회원정보를 찾을 수 없습니다. 다시 로그인해주세요.'
      );
    }

    const refreshToken = await redisClient.get(String(id));
    const checkRefresh = this.verifyToken(refreshToken);

    // case1: access token과 refresh token 모두만료
    if (!checkAccess && !checkRefresh) {
      throw new TokenServiceError(
        UNAUTHORIZED,
        '토큰이 만료되었습니다. 다시 로그인해주세요.'
      );
    }

    // case2: access token만 만료
    if (!checkAccess && checkRefresh) {
      console.log('accessToken 재발급');
      accessToken = jwt.sign({ id }, TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRED,
      });
      res.cookie('accessToken', accessToken);
    }

    // case3: refresh token만 만료
    if (checkAccess && !checkRefresh) {
      console.log('refreshToken 만료');
      res.clearCookie('accessToken');
      throw new TokenServiceError(
        UNAUTHORIZED,
        'refreshToken 만료, 다시 로그인해주세요.'
      );
    }

    res.locals.user = user;
    next();
  });

  // 로그아웃을 위한 단순 user정보 파악
  whoIsUser = asyncErrorCatcher(async (req, res, next) => {
    try {
      const cookie = req.cookies;
      const { accessToken } = cookie;
      if (!accessToken) {
        throw new TokenServiceError(
          UNAUTHORIZED,
          '토큰이 존재하지 않습니다. 다시 로그인해주세요.'
        );
      }
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
  });
}

module.exports = Token;
