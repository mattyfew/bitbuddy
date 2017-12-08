const express = require('express')
const app = express()
const compression = require('compression')
const bodyParser = require('body-parser')
const multer = require('multer')
const uidSafe = require('uid-safe')
const path = require('path')
const knox = require('knox')
const fs = require('fs');
const db = require('./db/db')
const s3 = require('./s3')

app.use(compression())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const cookieSession = require('cookie-session')

var diskStorage = multer.diskStorage({
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname))
        })
    }
})

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
})


app.use(cookieSession({
    secret: 'raisins',
    maxAge: 1000 * 60 * 60 * 24 * 14
}))

if (process.env.NODE_ENV != 'production') {
    app.use('/bundle.js', require('http-proxy-middleware')({
        target: 'http://localhost:8081/'
    }))
}

app.use(express.static('public'))




app.post('/register-new-user', (req, res) => {
    const { firstname, lastname, username, email, password } = req.body

    db.registerNewUser(firstname, lastname, username, email, password)
        .then(({ id, firstname, lastname, username, email }) => {
            req.session.user = { id, firstname, lastname, username, email }
            res.json({ success: true })
        })
        .catch(err => console.log("There was an error in POST /register-new-user", err) )
})

app.post('/login-user', (req, res) => {
    console.log("in POST /login-user", req.body)

    db.loginUser(req.body.email, req.body.password)
        .then(results => {
            req.session.user = {
                id: results.id,
                firstname: results.firstname,
                lastname: results.lastname,
                email: results.email,
                username: results.username
            }
            res.redirect('/')
        })
        .catch(err => console.log("There was an error in loginUser", err) )
})

app.post('/uploadImage', uploader.single('profilepic'), function(req, res) {
    if (req.file) {
        s3.upload(req.file).then(function() {
            db.saveImage(req.file.filename, req.session.user.email).then(function(image) {
                res.json({success: true, image: image});
            })
        })
    } else {
        res.json({success: false});
    }
});


app.get('/get-user-info', (req, res) => {
    db.getUserInfo(req.session.user.id)
        .then(userInfo => {
            res.json(userInfo)
        })
})

app.get('/get-other-user-info/:userId', (req, res) => {
    db.getUserInfo(req.params.userId)
        .then(userInfo => {
            res.json(userInfo)
        })
})


app.get('/welcome/', (req, res) => {
    if (req.session.user) res.redirect('/')

    res.sendFile(__dirname + '/index.html')
})


app.get('/', (req, res) => {
    if (!req.session.user) res.redirect('/welcome/')

    res.sendFile(__dirname + '/index.html')
})

app.get('*', function(req, res){
    res.sendFile(__dirname + '/index.html')
})

app.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening on port 8080.")
})
