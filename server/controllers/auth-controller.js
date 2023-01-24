const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const HttpError = require('../models/http-error')
const User = require('../models/User')

const register = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passes, please check your data', 422));
    }
    if (req.file.size > 1000000) {
        return next(new HttpError('Image Size is greater than 1MB', 422))
    }
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            location,
            twitter,
            linkedIn
        } = req.body
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            throw new HttpError('User already exist, Try to login', 500)
        }
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath: req.file.path,
            friends: [],
            location,
            twitter,
            linkedIn
        })
        const id = newUser.toObject({ getters: true }).id
        const token = jwt.sign({ userId: newUser.id, email: newUser.email }, process.env.JWT_SECRET);
        const savedUser = await newUser.save()
        res.status(201).json({ token: token, userId: id })
    } catch (error) {
        return next(new HttpError(error.message || 'Registration Failed', 500))
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email }, { email: true, password: true, id: true })
        if (!user) {
            throw new HttpError('Invalid credentials', 401)
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new HttpError('Invalid credentials', 401)
        }
        console.log(typeof id, user.id)
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET);
        res.status(201).json({ token: token, userId: user.toObject({ getters: true }).id })
    } catch (error) {
        return next(new HttpError(error.message || `Not able to login, please try again later`, error.code || 500))
    }
}

exports.register = register
exports.login = login