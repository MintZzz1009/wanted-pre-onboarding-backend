const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/users.repository');
const PostRepository = require('../repositories/posts.repository');
const { User, Post } = require('../models');
const { asyncErrorCatcher } = require('../utils/asyncErrorCatcher');
const { ValidationError, ApplicationError } = require('../utils/apiError');
const {
  StatusCodes: { NOT_FOUND, FORBIDDEN },
} = require('http-status-codes');
class Validator {
  userRepository = new UserRepository(User);
  postRepository = new PostRepository(Post);

  isValid = asyncErrorCatcher(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email.includes('@')) {
      throw new ValidationError('이메일의 형식이 올바르지 않습니다.');
    }
    if (password.length < 8) {
      throw new ValidationError('비밀번호는 8자 이상이어야 합니다.');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // hashed를 데이터베이스에 저장한다.
    res.locals.user = { email, hashedPassword };
    next();
  });

  isNew = asyncErrorCatcher(async (req, res, next) => {
    const { email } = res.locals.user;
    const isNotNew = await this.userRepository.findUser(email);
    if (isNotNew) {
      throw new ValidationError(
        '이미 존재하는 이메일입니다. 다른 이메일로 회원가입해주세요.'
      );
    }
    next();
  });

  compareUserInfo = asyncErrorCatcher(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await this.userRepository.findUser(email);
    if (!user) {
      throw new ValidationError('이메일이나 비밀번호가 올바르지 않습니다.');
    }
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new ValidationError('이메일이나 비밀번호가 올바르지 않습니다.');
    }
    next();
  });

  hasTitleAndContent = (req, res, next) => {
    // post의 title과 content가 null값이 나오지 않도록 검증W
    const { title, content } = req.body;
    if (!title) {
      throw new ValidationError('제목을 입력해주세요.');
    }
    if (!content) {
      throw new ValidationError('내용을 입력해주세요.');
    }
    next();
  };

  isWriter = asyncErrorCatcher(async (req, res, next) => {
    const { id: updater } = res.locals.user;
    const { id: postId } = req.params;
    const postInfo = await this.postRepository.findPost(postId);
    if (!postInfo) {
      throw new ApplicationError(NOT_FOUND, '존재하지 않는 게시글입니다.');
    }
    if (postInfo.writer !== updater) {
      throw new ApplicationError(
        FORBIDDEN,
        '게시글은 작성자만 수정하거나 삭제할 수 있습니다.'
      );
    }
    next();
  });
}

module.exports = Validator;
