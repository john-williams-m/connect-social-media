const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
    },
    picturePath: {
        type: String,
        required: true
    },
    userPicturePath: {
        type: String,
        required: true
    },
    likes: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    }
},
    {
        timestamps: true
    })

const Post = mongoose.model("Post", postSchema)
module.exports = Post