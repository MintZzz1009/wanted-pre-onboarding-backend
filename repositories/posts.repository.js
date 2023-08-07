const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { User } = require('../models');

class PostRepository {
  constructor(UserModel, PostModel) {
    this.userModel = UserModel;
    this.postModel = PostModel;
  }

  findAllPosts = async () => {};

  findPostById = async () => {};

  createNewPost = async () => {};

  updatePost = async () => {};

  deletePost = async () => {};
}

module.exports = PostRepository;
