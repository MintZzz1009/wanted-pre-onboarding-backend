const PostRepository = require('../repositories/posts.repository');
const { Post } = require('../models');

class PostService {
  postRepository = new PostRepository(Post);

  getAllPosts = async () => {
    try {
      return await this.postRepository.findAllPosts();
    } catch (error) {
      throw error;
    }
  };

  getPost = async (id) => {
    try {
      return await this.postRepository.findPost(id);
    } catch (error) {
      throw error;
    }
  };

  postNewPost = async (title, content, writer) => {
    try {
      return await this.postRepository.createNewPost(title, content, writer);
    } catch (error) {
      throw error;
    }
  };

  putPost = async (id, title, content) => {
    try {
      return await this.postRepository.updatePost(id, title, content);
    } catch (error) {
      throw error;
    }
  };

  deletePost = async (id) => {
    try {
      return await this.postRepository.destroyPost(id);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = PostService;
