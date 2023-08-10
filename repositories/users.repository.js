const { Op } = require('sequelize');
const { User } = require('../models');

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

  findUserByEmail = async (email, password) => {
    console.log('findUserByEmail 입니다');
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
      await this.userModel.create({
        email,
        password,
      });
    } catch (error) {
      throw error;
    }
  };

  saveRefreshToken = async (id, refreshToken) => {
    try {
      await this.userModel.update(
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
      await this.userModel.update(
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
