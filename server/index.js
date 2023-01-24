if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const helmet = require('helmet')
const path = require('path')
const app = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

const { cloudinary } = require('./middleware/cloudinary')

const authRoutes = require('./routes/auth-routes')
const userRoutes = require('./routes/user-routes')
const postRoutes = require('./routes/post-routes')

app.use(express.json({ extended: true }))
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(express.urlencoded({ extended: true }))
app.use('/assets', express.static(path.join('public', 'assets')));

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)
app.get('/', (req, res) => {
    res.status(200).json({ "message": "Working" })
})
app.use((error, req, res, next) => {
    if (req.file) {
        cloudinary.uploader.destroy(req.file.filename)
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'Something went wrong!' })
})
const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(PORT, () => console.log(`DataBase connected and listening on port: ${PORT}`))
}).catch(err => { console.log(`Not able to connect! ${err}`) })