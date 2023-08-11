const PostRepository = require('../repositories/posts.repository');
const { Post } = require('../models');

class PostService {
  postRepository = new PostRepository(Post);

  getAllPostsWithPage = async (pageNo = 1) => {
    try {
      if (pageNo === 'all') {
        return await this.postRepository.findAllPosts();
      }
      const pageSize = parseInt(process.env.PAGE_SIZE);
      const countAllPosts = await this.postRepository.countAllPosts();
      const lastPageNo = Math.ceil(countAllPosts / pageSize);
      if (pageNo > lastPageNo) {
        pageNo = lastPageNo;
      }
      const offset = (parseInt(pageNo) - 1) * pageSize;
      return await this.postRepository.findAllPostsWithPage(offset, pageSize);
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
