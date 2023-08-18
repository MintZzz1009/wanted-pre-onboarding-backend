const Validator = require('./validator');
const validator = new Validator();

describe('isValid', () => {
  const res = {
    status: jest.fn(() => res), // 메서드 체이닝으로 인해 res.status().json()의 값을 받기 위해서.
    json: jest.fn(), // jest.fn(() => true) 반환값이 true인 가짜함수
    locals: { user: {} },
  };
  const next = jest.fn();

  test('email, password 형식이 올바르면 isValid가 next()를 호출해야 함', async () => {
    const req = {
      body: {
        email: '@',
        password: '12345678',
      },
    };
    await validator.isValid(req, res, next);
    expect(next).toBeCalledTimes(1); // next가 호출되었는지 - toBeCalledTimes(1) 한 번만 호출되었는지
  });

  test('email에 @가 없으면 isValid가 res.status(400).json({msg:이메일 형식 오류})를 호출함', () => {
    const req = {
      body: {
        email: '#',
        password: '12345678',
      },
    };
    validator.isValid(req, res, next);
    expect(res.status).toBeCalledWith(400); // 매개변수도 추적할 수 있다.
    expect(res.json).toBeCalledWith({
      message: '이메일의 형식이 올바르지 않습니다.',
    });
  });

  test('password가 8자 미만이면 isValid가 res.status(400).json({msg:비밀번호 글자수 오류})를 호출함', () => {
    const req = {
      body: {
        email: '@',
        password: '1234567',
      },
    };
    validator.isValid(req, res, next);
    expect(res.status).toBeCalledWith(400); // 매개변수도 추적할 수 있다.
    expect(res.json).toBeCalledWith({
      message: '비밀번호는 8자 이상이어야 합니다.',
    });
  });
});

describe('isNew', () => {
  const req = {};
  const res = {
    status: jest.fn(() => res), // 메서드 체이닝으로 인해 res.status().json()의 값을 받기 위해서.
    json: jest.fn(), // jest.fn(() => true) 반환값이 true인 가짜함수
    locals: { user: { email: '@' } },
  };
  const next = jest.fn();

  test('이미 존재하는 email이면 res.status(400).json({msg:이미 존재하는 이메일, 다른 이메일로 회원가입하세요})', async () => {
    validator.userRepository.findUser = jest.fn(() => true);
    await validator.isNew(req, res, next);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      message: '이미 존재하는 이메일입니다. 다른 이메일로 회원가입해주세요.',
    });
    expect(next).toBeCalledTimes(0);
  });

  test('새로운 email이면 next() 호출', async () => {
    validator.userRepository.findUser = jest.fn(() => null);
    await validator.isNew(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
});

describe('compareUserInfo', () => {
  jest.mock('bcrypt', () => {});
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();
  const user = {
    email: '@',
    password: '$2b$10$1Y9nEMh0WNvh8.hOnHuuT./sMM/lWh0sExoQwJCdYYEwkJG5VwdXW',
  };

  test('이메일에 해당하는 비밀번호와 요청의 비밀번호가 일치하지 않을 경우 => 400, message', async () => {
    const req = {
      body: { email: '@', password: '12345677' },
    };
    validator.userRepository.findUser = jest.fn(() => user); // test 위에서 실행하면 안된다... 왜??
    await validator.compareUserInfo(req, res, next);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      message: '이메일이나 비밀번호가 올바르지 않습니다.',
    });
  });

  test('이메일과 비밀번호와 요청의 비밀번호가 일치하면 => next() 호출', async () => {
    const req = {
      body: { email: '@', password: '12345678' },
    };
    // validator.userRepository.findUser = jest.fn(() => user); // test 위에서 실행하면 안된다... 왜??
    await validator.compareUserInfo(req, res, next);
    // expect(res.status).toBeCalledWith(403);
    // expect(res.json).toBeCalledWith({ m: 1 });
    expect(next).toBeCalledTimes(1);
  });
});

describe('hasTitleAndContent', () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();

  test('제목이 없으면 => 400, msg', () => {
    const req = {
      body: {
        title: '',
        content: 'content',
      },
    };
    validator.hasTitleAndContent(req, res, next);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({ message: '제목을 입력해주세요.' });
  });

  test('내용이 없으면 => 400, msg', () => {
    const req = {
      body: {
        title: 'title',
        content: '',
      },
    };
    validator.hasTitleAndContent(req, res, next);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({ message: '내용을 입력해주세요.' });
  });

  test('제목, 내용 둘 다 있으면 => next() 호출', () => {
    const req = {
      body: {
        title: 'title',
        content: 'content',
      },
    };
    validator.hasTitleAndContent(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
});

describe('isWriter', () => {
  const req = {
    params: 14,
  };
  const res = {
    status: jest.fn(() => res), // 메서드 체이닝으로 인해 res.status().json()의 값을 받기 위해서.
    json: jest.fn(), // jest.fn(() => true) 반환값이 true인 가짜함수
    locals: { user: { id: 12 } },
  };
  const next = jest.fn();

  test('로그인한 사람과 작성자가 같을 때 => next() 호출', async () => {
    const postInfo = {
      writer: 12,
    };
    validator.postRepository.findPost = jest.fn(() => postInfo);
    await validator.isWriter(req, res, next);
    expect(next).toBeCalledTimes(1);
  });

  test('존재하지 않는 게시글일 때', async () => {
    validator.postRepository.findPost = jest.fn(() => null);
    await validator.isWriter(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith({
      message: '존재하지 않는 게시글입니다.',
    });
  });

  test('게시글 작성자와 요청자가 다를 때', async () => {
    const postInfo = {
      writer: 99,
    };
    validator.postRepository.findPost = jest.fn(() => postInfo);
    await validator.isWriter(req, res, next);
    expect(res.status).toBeCalledWith(403);
    expect(res.json).toBeCalledWith({
      message: '게시글은 작성자만 수정하거나 삭제할 수 있습니다.',
    });
  });
});
