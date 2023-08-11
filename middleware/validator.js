const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/users.repository');
const PostRepository = require('../repositories/posts.repository');
const { User, Post } = require('../models');
class Validator {
  userRepository = new UserRepository(User);
  postRepository = new PostRepository(Post);

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
    try {
      const { email, password } = req.body;
      const user = await this.userRepository.findUser(email);
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res
          .status(400)
          .json({ message: '이메일이나 비밀번호가 올바르지 않습니다.' });
      }
    } catch (error) {
      return res
        .status(400)
        .json({ message: '이메일이나 비밀번호가 올바르지 않습니다.' });
    }
    next();
  };

  hasTitleAndContent = async (req, res, next) => {
    // post의 title과 content가 null값이 나오지 않도록 검증
    try {
      const { title, content } = req.body;
      if (!title) {
        return res.status(400).json({ message: '제목을 입력해주세요.' });
      }
      if (!content) {
        return res.status(400).json({ message: '내용을 입력해주세요.' });
      }
      next();
    } catch (error) {
      throw error;
    }
  };

  isWriter = async (req, res, next) => {
    try {
      const { id: updater } = res.locals.user;
      const { id: postId } = req.params;
      const postInfo = await this.postRepository.findPost(postId);
      if (!postInfo) {
        return res.status(404).json({
          message: '존재하지 않는 게시글입니다.',
        });
      }
      if (postInfo.writer !== updater) {
        return res.status(400).json({
          message: '게시글은 작성자만 수정하거나 삭제할 수 있습니다.',
        });
      }
      next();
    } catch (error) {
      throw error;
    }
  };
}

module.exports = Validator;

// TODO: 비밀번호 암호화
//       post 기능 3계층 코드 작성
//       error 처리 custom 만들기
//       post validator(title, content)
//       pagination
//
//       가산점 선택
//       jest로 테스트코드
//       aws, docker container 설계해보기
