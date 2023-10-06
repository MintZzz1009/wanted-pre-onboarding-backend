const PostRepository = require('../repositories/posts.repository');
const { Post } = require('../models');

class PostService {
  postRepository = new PostRepository(Post);

  getAllPostsWithPage = async (pageNo = 1) => {
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
  };

  getPost = async (id) => await this.postRepository.findPost(id);

  postNewPost = async (title, content, writer) =>
    await this.postRepository.createNewPost(title, content, writer);

  putPost = async (id, title, content) =>
    await this.postRepository.updatePost(id, title, content);

  deletePost = async (id) => await this.postRepository.destroyPost(id);
}

module.exports = PostService;
