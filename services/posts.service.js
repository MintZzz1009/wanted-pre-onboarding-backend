const PostRepository = require('../repositories/posts.repository');
const { Post } = require('../models');

class PostService {
  postRepository = new PostRepository(Post);

  getAllPosts = async (req, res) => {};

  getPost = async (req, res) => {};

  postNewPost = async (req, res) => {};

  putPost = async (req, res) => {};

  deletePost = async (req, res) => {};
}

module.exports = PostService;
