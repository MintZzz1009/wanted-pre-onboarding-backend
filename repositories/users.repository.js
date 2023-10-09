const { Op } = require('sequelize');

class UserRepository {
  constructor(UserModel) {
    this.userModel = UserModel;
  }

  findUser = async (email, password) =>
    await this.userModel.findOne({
      where: { email },
    });

  createNewUser = async (email, password) =>
    await this.userModel.create({
      email,
      password,
    });

  saveRefreshToken = async (id, refreshToken) =>
    await this.userModel.update(
      {
        refreshToken,
      },
      { where: { id } }
    );

  // refreshToken을 redis가 아닌 DB에 저장할시
  clearRefreshToken = async (id) =>
    await this.userModel.update(
      {
        refreshToken: '',
      },
      {
        where: { id },
      }
    );
}

module.exports = UserRepository;
