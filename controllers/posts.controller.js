const PostService = require('../services/posts.service');

class PostsController {
  postService = new PostService();

  // 전체 게시글 조회
  getAllPosts = async (req, res) => {
    try {
      const { pageNo } = req.query;
      const allPosts = await this.postService.getAllPostsWithPage(pageNo);
      return res.status(200).json(allPosts);
    } catch (error) {
      throw error;
    }
  };

  // 특정 게시글 조회
  getPost = async (req, res) => {
    try {
      const { id } = req.params;
      const post = await this.postService.getPost(id);
      if (!post) {
        return res.status(404).json({ message: '존재하지 않는 게시글입니다.' });
      }
      return res.status(200).json(post);
    } catch (error) {
      throw error;
    }
  };

  // 게시글 생성
  postNewPost = async (req, res) => {
    try {
      const { title, content } = req.body;
      const { id: writer } = res.locals.user;
      await this.postService.postNewPost(title, content, writer);
      return res.status(201).json({ message: '게시글이 생성되었습니다.' });
    } catch (error) {
      throw error;
    }
  };

  // 게시글 수정
  putPost = async (req, res) => {
    try {
      const { title, content } = req.body;
      const { id } = req.params;
      await this.postService.putPost(id, title, content);
      return res.status(201).json({ message: '게시글 수정이 완료되었습니다.' });
    } catch (error) {
      throw error;
    }
  };

  // 게시글 삭제
  deletePost = async (req, res) => {
    try {
      const { id } = req.params;
      await this.postService.deletePost(id);
      return res.status(204).json();
    } catch (error) {
      throw error;
    }
  };
}

module.exports = PostsController;
