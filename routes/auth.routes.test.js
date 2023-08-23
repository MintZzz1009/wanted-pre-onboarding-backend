const app = require('../app'); // 통합 테스트이므로 라우터를 불러오는 것이 아니라 app을 불러온다
const { sequelize } = require('../models');
const request = require('supertest');

beforeAll(async () => {
  await sequelize.sync({ force: true }); // 가짜 ORM 생성
});

const loginTestObj = {
  email: 'wanted@example.com',
  password: 'wantedtest',
};
const isNotEmailForm = {
  email: 'wantedexample.com',
  password: 'wantedtest',
};
const shortPassword = {
  email: 'wanted@example.com',
  password: 'wanted',
};

describe('POST /auth/signup', () => {
  const joinTestObj = {
    email: 'jointest@example.com',
    password: 'jointest',
  };

  test('정상 회원가입 수행', async () => {
    const res = await request(app).post('/auth/signup').send(joinTestObj);
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('회원가입이 완료되었습니다.');
  });

  test('이메일 형식 아님', async () => {
    const res = await request(app).post('/auth/signup').send(isNotEmailForm);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('이메일의 형식이 올바르지 않습니다.');
  });

  test('8자 이하의 비밀번호', async () => {
    const res = await request(app).post('/auth/signup').send(shortPassword);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('비밀번호는 8자 이상이어야 합니다.');
  });

  test('이미 회원가입된 이메일일 경우', async () => {
    const res = await request(app).post('/auth/signup').send(joinTestObj);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      '이미 존재하는 이메일입니다. 다른 이메일로 회원가입해주세요.'
    );
  });
});

describe('PATCH /auth/signin', () => {
  const UnexistUser = {
    email: 'want@example.com',
    password: 'wanttest',
  };
  const wrongPassword = {
    email: 'wanted@example.com',
    password: 'wanttest',
  };

  beforeAll(async () => {
    // 로그인 테스트 수행 전 회원가입 시키기
    await request(app).post('/auth/signup').send(loginTestObj);
  });

  test('정상 로그인 수행', async () => {
    const res = await request(app).patch('/auth/signin').send(loginTestObj);
    const cookie = res.headers['set-cookie'][0];
    const hasToken = cookie.includes('accessToken') && cookie.length > 150;
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('로그인이 완료되었습니다.');
    expect(hasToken).toBeTruthy();
  });

  test('이메일 형식 아님', async () => {
    const res = await request(app).patch('/auth/signin').send(isNotEmailForm);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('이메일의 형식이 올바르지 않습니다.');
  });

  test('8자 이하의 비밀번호', async () => {
    const res = await request(app).patch('/auth/signin').send(shortPassword);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('비밀번호는 8자 이상이어야 합니다.');
  });

  test('존재하지 않는 유저 정보로 로그인', async () => {
    const res = await request(app).patch('/auth/signin').send(UnexistUser);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('이메일이나 비밀번호가 올바르지 않습니다.');
  });

  test('틀린 비밀번호 입력', async () => {
    const res = await request(app).patch('/auth/signin').send(wrongPassword);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('이메일이나 비밀번호가 올바르지 않습니다.');
  });
});

describe('DELETE /auth/signout', () => {
  const agent = request.agent(app); // 변수에 담을 때는 request.agent(app), 그냥 쓸 때는 request(app)
  // 새로운 요청이 아니라 원래 요청에서의 정보를 테스트 하고싶을 경우, 변수에 할당해서 쓸 수 있다.

  beforeAll(async () => {
    // 로그아웃 테스트 수행 전 회원가입 및 로그인 시키기
    await request(app).post('/auth/signup').send(loginTestObj);
    await agent.patch('/auth/signin').send(loginTestObj);
  });

  test('정상 로그아웃 수행', async () => {
    const res = await agent.delete('/auth/signout');
    const cookie = res.headers['set-cookie'][0];
    const clearAccessToken = cookie.includes('accessToken=;');
    expect(res.status).toBe(204);
    expect(clearAccessToken).toBeTruthy();
  });

  test('토큰에 문제가 생겨 로그아웃 수행', async () => {
    const res = await request(app).delete('/auth/signout');
    const cookie = res.headers['set-cookie'][0];
    const clearAccessToken = cookie.includes('accessToken=;');
    expect(res.status).toBe(401);
    expect(clearAccessToken).toBeTruthy();
  });
});
