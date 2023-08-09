const PostService = require('../services/posts.service');

class PostsController {
  postService = new PostService();

  // 전체 게시글 조회
  getAllPosts = async (req, res) => {};

  // 특정 게시글 조회
  getPost = async (req, res) => {};

  // 게시글 생성
  postNewPost = async (req, res) => {
    console.log(`req.body: ${req.body}`);
    console.log(`res.locals.user: ${res.locals.user}`);
    return res.json({ message: 'postNewPost 입니당' });
  };

  // 게시글 수정
  putPost = async (req, res) => {};

  // 게시글 삭제
  deletePost = async (req, res) => {};
}

module.exports = PostsController;
