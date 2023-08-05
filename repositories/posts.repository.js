const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { User } = require('../models');

class ProjectRepository {
  constructor(ProjectModel, ProjectLikeModel) {
    this.projectModel = ProjectModel;
    this.projectLikeModel = ProjectLikeModel;
  }

  findAllPosts = async () => {};

  findPostById = async () => {};

  createNewPost = async () => {};

  updatePost = async () => {};

  deletePost = async () => {};
}

module.exports = ProjectRepository;
