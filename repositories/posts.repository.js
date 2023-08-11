const { Op } = require('sequelize');
const { User } = require('../models');

class PostRepository {
  constructor(PostModel) {
    this.postModel = PostModel;
  }

  findAllPosts = async () => {
    try {
      return await this.postModel.findAll({
        include: [
          {
            model: User,
            attributes: ['email'],
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  };

  countAllPosts = async () => {
    try {
      return await this.postModel.count();
    } catch (error) {
      throw error;
    }
  };

  findAllPostsWithPage = async (offset, limit) => {
    try {
      return await this.postModel.findAndCountAll({
        include: [
          {
            model: User,
            attributes: ['email'],
          },
        ],
        offset,
        limit,
      });
    } catch (error) {
      throw error;
    }
  };

  findPost = async (id) => {
    try {
      return await this.postModel.findOne({
        where: { id },
        include: [
          {
            model: User,
            attributes: ['email'],
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  };

  createNewPost = async (title, content, writer) => {
    try {
      return await this.postModel.create({ title, content, writer });
    } catch (error) {
      throw error;
    }
  };

  updatePost = async (id, title, content) => {
    try {
      return await this.postModel.update({ title, content }, { where: { id } });
    } catch (error) {
      throw error;
    }
  };

  destroyPost = async (id) => {
    try {
      return await this.postModel.destroy({ where: { id } });
    } catch (error) {
      throw error;
    }
  };
}

module.exports = PostRepository;
