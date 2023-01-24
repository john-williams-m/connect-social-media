const HttpError = require("../models/http-error");
const User = require("../models/User");
const { validationResult } = require('express-validator')

const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const userData = await User.findById(userId, { password: false }).populate('friends')
        res.status(200).json(userData.toObject({ getters: true }))
    } catch (error) {
        return next(new HttpError('Fetching user data failed', 500))
    }
}

const addRemoveFriend = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passes, please check your data', 422));
    }
    try {
        const userId = req.user.userId
        const friendId = req.body.friendId
        const isFriend = req.body.isFriend
        const userData = await User.findById(userId)
        const friend = await User.findById(friendId)
        if (isFriend) {
            msg = 'removed'
            userData.friends.pull(friend)
            friend.friends.pull(userData)
        }
        else {
            userData.friends.push(friend)
            friend.friends.push(userData)
        }
        await friend.save()
        await userData.save()

        const newUserData = await User.findById(userId).populate('friends')
        res.status(200).json({ newUserData: newUserData.toObject({ getters: true }) })

    } catch (error) {
        return next(new HttpError('Add or removal of friend from friend list has been failed, please try again later', 500))
    }
}

const updateUserProfile = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passes, please check your data', 422));
    }
    try {
        const userId = req.user.userId
        const loggedInUserId = req.params.id
        console.log(userId, loggedInUserId)
        const { firstName, lastName, location, twitter, linkedIn } = req.body
        if (userId != loggedInUserId) {
            throw new HttpError('You are not allowed to Edit Others Profile', 401)
        }
        const userData = await User.findById(userId)
        if (!userData) {
            throw new HttpError('Update failed, Try again later', 404)
        }
        await User.findByIdAndUpdate(userId, { firstName, lastName, twitter, linkedIn, location }, { runValidators: true })
        const updatedUserProfile = await User.findById(userId, { password: false })
        res.status(201).json(updatedUserProfile.toObject({ getters: true }))
    } catch (err) {
        return next(new HttpError(err.message || 'Profile updation failed, Try again later', 500))
    }
}

exports.getUserById = getUserById
exports.addRemoveFriend = addRemoveFriend
exports.updateUserProfile = updateUserProfile