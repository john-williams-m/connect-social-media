const { validationResult } = require('express-validator')
const User = require("../models/User")
const Post = require("../models/Post")
const HttpError = require("../models/http-error")


const createPost = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passes, please check your data', 422));
    }
    if (req.file.size > 1000000) {
        return next(new HttpError('Image Size is greater than 1MB', 422))
    }
    console.log(req.file)
    try {
        const userId = req.user.userId
        const { description } = req.body
        const userData = await User.findById(userId)
        const newPost = new Post({
            userId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            location: userData.location,
            description,
            userPicturePath: userData.picturePath,
            picturePath: req.file.path
        })
        await newPost.save()
        res.status(201).json(newPost.toObject({ getters: true }))
    } catch (error) {
        return next(new HttpError(error.message || 'Failed to create new post, please try again later', error.code || 500))
    }
}

const getFeedPosts = async (req, res, next) => {
    try {
        const posts = await Post.find()
        replacedWithGetters = posts.map(post => post.toObject({ getters: true }))
        res.status(200).json(replacedWithGetters)
    } catch (error) {
        return next(new HttpError('Failed to fetch posts, please try again later', 500))
    }
}


const getUserPost = async (req, res, next) => {
    try {
        const userId = req.params.userId
        const posts = await Post.find({ userId: userId })
        replacedWithGetters = posts.map(post => post.toObject({ getters: true }))
        res.status(200).json(replacedWithGetters)
    } catch (error) {
        return next(new HttpError(error.message || 'Failed to fetch the user post(s)', error.code || 500))
    }
}

const likeOrUnlikePost = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passes, please check your data', 422));
    }
    try {
        const { id } = req.params
        const { userId } = req.body
        const loggedInUser = req.user.userId
        if (loggedInUser !== userId) {
            return next(new HttpError('You are not allowed to like or unlike this post', 422))
        }
        const post = await Post.findById(id)
        const isLiked = post.likes.includes(userId)
        let index
        if (isLiked) {
            index = post.likes.indexOf(userId)
            if (index > -1) {
                post.likes.splice(index, 1)
            }
        }
        else {
            post.likes = post.likes.concat(userId)
        }
        const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true })
        res.status(200).json(updatedPost.toObject({ getters: true }))
    } catch (error) {
        return next(new HttpError(error.message || 'Like or Unlike action failed, please try again later', error.code || 500))
    }
}

const addComment = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passes, please check your data', 422));
    }
    try {
        // const userId = req.user.userId
        const { postId, comment } = req.body
        const post = await Post.findById(postId)
        if (!post) {
            throw new HttpError('Post not found', 404)
        }
        if (comment) {
            post.comments.push(comment)
        }
        const response = await post.save()
        const updatedPost = await Post.findById(postId)
        res.status(201).json(updatedPost.toObject({ getters: true }))
    } catch (error) {
        throw new HttpError(error.message || 'Failed to add comment', error.code || 500)
    }
}

exports.createPost = createPost
exports.getFeedPosts = getFeedPosts
exports.getUserPost = getUserPost
exports.likeOrUnlikePost = likeOrUnlikePost
exports.addComment = addComment