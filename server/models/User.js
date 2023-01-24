const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 5
    },
    picturePath: {
        type: String,
        default: ''
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    location: String,
    twitter: {
        type: String,
        default: null
    },
    linkedIn: {
        type: String,
        default: null
    }

},
    { timestamps: true }
)

const User = mongoose.model('User', UserSchema)
module.exports = User