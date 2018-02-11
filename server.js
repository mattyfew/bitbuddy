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
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { getSessionFromSocket } = require('socket-cookie-session')

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
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
app.use(express.static('public'))

io.on('connection', function(socket) {
    console.log("ajds;");
    console.log(`socket with the id ${socket.id} is now connected`)
    const session = getSessionFromSocket(socket, {
        secret: 'a very secretive secret'
    })

    if (!session || !session.user) {
        return socket.disconnect(true);
    }

    const userId = session.user.id;


    socket.on('disconnect', function() {
        console.log(`socket with the id ${socket.id} is now disconnected`)
    })

    socket.on('thanks', function(data) {
        console.log(data)
    })

    socket.emit('welcome', {
        message: 'Welome. It is nice to see you'
    })
})


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

server.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening on port 8080.")
})
