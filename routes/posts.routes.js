const express = require('express');
const PostController = require('../controllers/posts.controller');

const router = express.Router();
const postController = new PostController();

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPost);
router.post('/:id', postController.postNewPost); // 추후 jwt 미들웨어 추가
router.put('/:id', postController.putPost); // 추후 jwt 미들웨어 추가
router.delete('/:id', postController.deletePost); // 추후 jwt 미들웨어 추가

module.exports = router;
