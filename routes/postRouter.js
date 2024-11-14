const express = require('express');
const postController = require("../controllers/postController");
const router = express.Router();

router.get('/', postController.getPosts);
router.get('/single-post/:id', postController.getSinglePost);
router.post('/create-post', postController.addPost);
router.put('/update-post/:id', postController.editPost);
router.delete('/delete-post/:id', postController.deletePost);

module.exports = router;