const express = require('express');
const PostController = require('../controllers/posts.controller');
const Token = require('../middleware/token');

const router = express.Router();
const postController = new PostController();
const token = new Token();

router.get('/', postController.getAllPosts);
router.post('/', token.checkToken, postController.postNewPost); // 추후 jwt 미들웨어 추가
router.get('/:id', postController.getPost);
router.put('/:id', token.checkToken, postController.putPost); // 추후 jwt 미들웨어 추가
router.delete('/:id', token.checkToken, postController.deletePost); // 추후 jwt 미들웨어 추가

module.exports = router;
