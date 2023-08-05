const { Op } = require('sequelize');
const { User } = require('../models');

class UserRepository {
  constructor(UserModel) {
    this.userModel = UserModel;
  }

  findAllPosts = async () => {};

  findPostById = async () => {};

  createNewPost = async () => {};

  updatePost = async () => {};

  deletePost = async () => {};
}

module.exports = UserRepository;
