const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/users.repository');
const { User } = require('../models');
class Validator {
  userRepository = new UserRepository(User);

  isValid = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email.includes('@')) {
      return res
        .status(400)
        .json({ message: '이메일의 형식이 올바르지 않습니다.' });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: '비밀번호는 8자 이상이어야 합니다.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // hashed를 데이터베이스에 저장한다.

    res.locals.user = { email, hashedPassword };
    next();
  };

  isNew = async (req, res, next) => {
    const { email } = res.locals.user;
    const isNotNew = await this.userRepository.findUser(email);
    if (isNotNew) {
      return res.status(400).json({
        message: '이미 존재하는 이메일입니다. 다른 이메일로 회원가입해주세요.',
      });
    }
    next();
  };

  compareUserInfo = async (req, res, next) => {
    // email 존재하는지 확인
    try {
      console.log('compareUserInfo 입니다');
      const { email, password } = req.body;
      const user = await this.userRepository.findUser(email);
      const validPassword = await bcrypt.compare(password, user.password);
      console.log(`validPassword: ${validPassword}`);

      if (!validPassword) {
        return res.status(400).send('이메일이나 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      return res.status(400).send('이메일이나 비밀번호가 올바르지 않습니다.');
    }
    next();
    // 암호화된 db에 저장된 비밀번호와 비교
  };
}

module.exports = Validator;

// TODO: 비밀번호 암호화
//       validator 미들웨어 만들기
//       post 기능 3계층 코드 작성
//       error 처리 custom 만들기
//
//       가산점 선택
//       jest로 테스트코드
//       aws, docker container 설계해보기
