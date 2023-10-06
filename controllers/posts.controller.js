const PostService = require('../services/posts.service');
const asyncErrorCatcher = require('../utils/asyncErrorCatcher');
const {
  StatusCodes: { OK, CREATED, NO_CONTENT, NOT_FOUND },
} = require('http-status-codes');

class PostsController {
  postService = new PostService();

  // 전체 게시글 조회
  getAllPosts = asyncErrorCatcher(async (req, res) => {
    const { pageNo } = req.query;
    const allPosts = await this.postService.getAllPostsWithPage(pageNo);
    return res.status(OK).json(allPosts);
  });

  // 특정 게시글 조회
  getPost = asyncErrorCatcher(async (req, res) => {
    const { id } = req.params;
    const post = await this.postService.getPost(id);
    if (!post) {
      return res
        .status(NOT_FOUND)
        .json({ message: '존재하지 않는 게시글입니다.' });
    }
    return res.status(OK).json(post);
  });

  // 게시글 생성
  postNewPost = asyncErrorCatcher(async (req, res) => {
    const { title, content } = req.body;
    const { id: writer } = res.locals.user;
    await this.postService.postNewPost(title, content, writer);
    return res.status(CREATED).json({ message: '게시글이 생성되었습니다.' });
  });

  // 게시글 수정
  putPost = asyncErrorCatcher(async (req, res) => {
    const { title, content } = req.body;
    const { id } = req.params;
    await this.postService.putPost(id, title, content);
    return res
      .status(CREATED)
      .json({ message: '게시글 수정이 완료되었습니다.' });
  });

  // 게시글 삭제
  deletePost = asyncErrorCatcher(async (req, res) => {
    const { id } = req.params;
    await this.postService.deletePost(id);
    return res.status(NO_CONTENT).json();
  });
}

module.exports = PostsController;
