const { Op } = require('sequelize');
const { User } = require('../models');

class PostRepository {
  constructor(PostModel) {
    this.postModel = PostModel;
  }

  findAllPosts = async () =>
    await this.postModel.findAll({
      include: [
        {
          model: User,
          attributes: ['email'],
        },
      ],
    });

  countAllPosts = async () => await this.postModel.count();

  findAllPostsWithPage = async (offset, limit) =>
    await this.postModel.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ['email'],
        },
      ],
      offset,
      limit,
    });

  findPost = async (id) =>
    await this.postModel.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ['email'],
        },
      ],
    });

  createNewPost = async (title, content, writer) =>
    await this.postModel.create({ title, content, writer });

  updatePost = async (id, title, content) =>
    await this.postModel.update({ title, content }, { where: { id } });

  destroyPost = async (id) => await this.postModel.destroy({ where: { id } });
}

module.exports = PostRepository;
