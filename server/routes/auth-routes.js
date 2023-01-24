const express = require('express')
const { check } = require('express-validator')
const multer = require('multer')
const authController = require('../controllers/auth-controller')
const router = express.Router()
const { storage } = require('../middleware/cloudinary')
const fileUpload = multer({ storage })

router.post('/register', fileUpload.single('picture'),
    [
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 5 }),
        check('firstName').not().isEmpty(),
        check('lastName').not().isEmpty(),
        check('location').not().isEmpty(),
    ], authController.register)

router.post('/login', authController.login)

module.exports = router