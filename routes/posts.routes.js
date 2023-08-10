const express = require('express');
const PostController = require('../controllers/posts.controller');
const Token = require('../middleware/token');
const Validator = require('../middleware/validator');

const router = express.Router();
const postController = new PostController();
const token = new Token();
const validator = new Validator();

router.get('/', postController.getAllPosts);
router.post(
  '/',
  token.checkToken,
  validator.hasTitleAndContent,
  postController.postNewPost
);
router.get('/:id', postController.getPost);
router.put(
  '/:id',
  token.checkToken,
  validator.isWriter,
  validator.hasTitleAndContent,
  postController.putPost
);
router.delete(
  '/:id',
  token.checkToken,
  validator.isWriter,
  postController.deletePost
);

module.exports = router;
