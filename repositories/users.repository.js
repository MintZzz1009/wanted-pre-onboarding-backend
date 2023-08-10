const { Op } = require('sequelize');
// const { User } = require('../models');

class UserRepository {
  constructor(UserModel) {
    this.userModel = UserModel;
  }

  findUser = async (email, password) => {
    try {
      return await this.userModel.findOne({
        where: { email },
      });
    } catch (error) {
      throw error;
    }
  };

  createNewUser = async (email, password) => {
    try {
      return await this.userModel.create({
        email,
        password,
      });
    } catch (error) {
      throw error;
    }
  };

  saveRefreshToken = async (id, refreshToken) => {
    try {
      return await this.userModel.update(
        {
          refreshToken,
        },
        { where: { id } }
      );
    } catch (error) {
      throw error;
    }
  };

  clearRefreshToken = async (id) => {
    try {
      return await this.userModel.update(
        {
          refreshToken: '',
        },
        {
          where: { id },
        }
      );
    } catch (error) {
      throw error;
    }
  };
}

module.exports = UserRepository;
