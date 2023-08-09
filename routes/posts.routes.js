const express = require('express');
const PostController = require('../controllers/posts.controller');
const TokenMiddleware = require('../middleware/token');

const router = express.Router();
const postController = new PostController();
const tokenMiddleware = new TokenMiddleware();

router.get('/', postController.getAllPosts);
router.post('/', tokenMiddleware.checkToken, postController.postNewPost); // 추후 jwt 미들웨어 추가
router.get('/:id', postController.getPost);
router.put('/:id', tokenMiddleware.checkToken, postController.putPost); // 추후 jwt 미들웨어 추가
router.delete('/:id', tokenMiddleware.checkToken, postController.deletePost); // 추후 jwt 미들웨어 추가

module.exports = router;
