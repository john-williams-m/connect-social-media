const express = require('express')
const { check } = require('express-validator')
const router = express.Router()
const multer = require('multer')
const { storage } = require('../middleware/cloudinary')
const fileUpload = multer({ storage })
const checkAuth = require('../middleware/checkAuth')
const postController = require('../controllers/post-controller')

router.get('/', postController.getFeedPosts)
router.post('/new', checkAuth, fileUpload.single('picture'),
    [
        check('description').not().isEmpty()
    ], postController.createPost)

router.get('/:userId', checkAuth, postController.getUserPost)

router.patch('/:id/like', checkAuth,
    [
        check('userId').not().isEmpty()
    ], postController.likeOrUnlikePost)

router.post('/comment', checkAuth,
    [
        check('postId').not().isEmpty(),
        check('comment').not().isEmpty()
    ], postController.addComment)

module.exports = router