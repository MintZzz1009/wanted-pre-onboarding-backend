const { Op } = require('sequelize');
const { User } = require('../models');

class UserRepository {
  constructor(UserModel) {
    this.userModel = UserModel;
  }

  findUser = async (email, password) => {
    try {
      return await this.userModel.findOne({
        where: { email, password },
      });

      // return { status: 200, message: '로그인 되었습니다.' };
    } catch (error) {
      throw error;
    }
  };

  createNewUser = async (email, password) => {
    try {
      await this.userModel.create({
        email,
        password,
      });

      return { status: 201, message: '회원가입이 완료되었습니다.' };
    } catch (error) {
      throw error;
    }
  };

  deleteUser = async () => {};
}

module.exports = UserRepository;
