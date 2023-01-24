const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const checkAuth = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new HttpError('Authorization Failed', 401)
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedData
        next();
    } catch (error) {
        return next(new HttpError('Authorization failed!', 401))
    }
}

module.exports = checkAuth