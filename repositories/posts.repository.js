const { Op } = require('sequelize');

class PostRepository {
  constructor(PostModel) {
    this.postModel = PostModel;
  }

  findAllPosts = async () => {
    try {
      return await this.postModel.findAll();
      // TODO: 페이지네이션 구현
    } catch (error) {
      throw error;
    }
  };

  findPost = async (id) => {
    try {
      return await this.postModel.findOne({ where: { id } });
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
