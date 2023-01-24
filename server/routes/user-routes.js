const express = require('express')
const { check } = require('express-validator')
const checkAuth = require('../middleware/checkAuth')
const userController = require('../controllers/user-controller')
const router = express.Router()

router.get('/:id', checkAuth, userController.getUserById)

router.patch('/:id/edit', checkAuth,
    [
        check('firstName').not().isEmpty(),
        check('lastName').not().isEmpty(),
        check('location').not().isEmpty(),

    ]
    , userController.updateUserProfile)

router.patch('/:id', checkAuth,
    [
        check('friendId').not().isEmpty(),
        check('isFriend').not().isEmpty()
    ],
    userController.addRemoveFriend)

module.exports = router