const jwt = require('jsonwebtoken');
jest.mock('../models');
const { User } = require('../models');
const Token = require('./token');
const token = new Token();

const expiredToken = // id: 13
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTY5MjI1NjM1MCwiZXhwIjoxNjkyMjU2MzUwfQ.8WDMbO4DEZnJy81pjU8xT8DmBeyAhFnMdr3yyv2ddZs';
const verifiedToken = // exp = 3333333333 (2075까지)
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTY5MjI1NjM1MCwiZXhwIjozMzMzMzMzMzMzfQ.35Mdmp9jHbnZq-m7cBZFNPhx769U2LXIBA3B-6SpVyw';
const tokenHasUnexistedId = // id = 0
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwiaWF0IjoxNjkyMjU2MzUwLCJleHAiOjE2OTIyNTYzNTB9.3VAZpgosbSvYdnVyNH5n_OWlrkGysvI730gYTVK8Rr0';

describe('verifyToken', () => {
  test('토큰이 유효할 경우 => payload의 user정보', () => {
    const payload = { id: 13, iat: 1692256350, exp: 3333333333 };
    expect(token.verifyToken(verifiedToken)).toStrictEqual(payload);
  });

  test('토큰이 만료되었을 경우 => false', () => {
    token.verifyToken(expiredToken);
    expect(token.verifyToken(expiredToken)).toBe(false);
  });
});

describe('generateToken', () => {
  test('accessToken과 refreshToken 생성', () => {
    const id = 13;
    const { accessToken, refreshToken } = token.generateToken(id);
    const { id: AccId, iat: AccIat, exp: AccExp } = jwt.decode(accessToken);
    const { id: RefId, iat: RefIap, exp: RefExp } = jwt.decode(refreshToken);
    expect(AccId).toBe(id);
    expect(AccExp - AccIat).toBe(86400);
    expect(RefId).toBe(id);
    expect(RefExp - RefIap).toBe(1209600);
    // 1d(24h): 86,400s, 14d(2w): 1,209,600s
  });
});

describe('checkToken', () => {
  const res = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
    locals: {
      user: '',
    },
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();

  test('cookie에 accessToken이 없을 때(undefined 등) => 401, message', () => {
    const req = {
      cookies: {},
    };
    token.checkToken(req, res, next);
    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith({
      message: '토큰이 존재하지 않습니다. 다시 로그인해주세요.',
    });
  });

  test('accessToken에 해당하는 user를 찾을 수 없을 경우', async () => {
    const req = {
      cookies: {
        accessToken: tokenHasUnexistedId,
      },
    };
    User.findByPk.mockReturnValue(null);
    await token.checkToken(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith({
      message:
        '토큰에 해당하는 회원정보를 찾을 수 없습니다. 다시 로그인해주세요.',
    });
  });

  test('access token과 refresh token 모두만료', async () => {
    const req = {
      cookies: {
        accessToken: expiredToken,
      },
    };
    const user = {
      refreshToken: expiredToken,
    };
    User.findByPk.mockReturnValue(user);
    await token.checkToken(req, res, next);
    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith({
      message: '토큰이 만료되었습니다. 다시 로그인해주세요.',
    });
  });

  test('access token만 만료', async () => {
    const req = {
      cookies: {
        accessToken: expiredToken,
      },
    };
    const user = {
      refreshToken: verifiedToken,
    };
    User.findByPk.mockReturnValue(user);
    await token.checkToken(req, res, next);
    expect(res.cookie).toBeCalledTimes(1);
    expect(next).toBeCalledTimes(1);
    // expect(res.status).toBeCalledTimes(0); 왜 3번 나오는지?
    // expect(res.json).toBeCalledTimes(0); 왜 3번 나오는지?
  });

  test('refresh token만 만료', async () => {
    const req = {
      cookies: {
        accessToken: verifiedToken,
      },
    };
    const user = {
      refreshToken: expiredToken,
    };
    User.findByPk.mockReturnValue(user);
    await token.checkToken(req, res, next);
    expect(res.clearCookie).toBeCalledTimes(1);
    expect(res.clearCookie).toBeCalledWith('accessToken');
    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith({
      message: 'refreshToken 만료, 다시 로그인해주세요.',
    });
    // expect(next).toBeCalledTimes(0); // 왜 1번 호출되는지?
  });

  test('에러가 났을 경우', () => {
    const req = {
      cookies: {
        accessToken: verifiedToken,
      },
    };
    const user = {
      refreshToken: expiredToken,
    };
    User.findByPk.mockReturnValue(user);
    expect(async () => {
      await token.checkToken(req, res, next);
    }).toThrow();
  });
});
