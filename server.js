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

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname))
        })
    }
})
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
})

const cookieSessionMiddleware = cookieSession({
    secret: 'raisins',
    maxAge: 1000 * 60 * 60 * 24 * 90
})
app.use(cookieSessionMiddleware)
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next)
})

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    )
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
app.use(express.static('public'))



// ======================================================
// ====================== SOCKET.IO =====================
// ======================================================

let onlineUsers = []

const getOnlineUsers = () => {
    let ids = onlineUsers.map(user => user.userId)

    ids = ids.filter((id, i) => {
        return ids.indexOf(id) == i
    })
    return db.getUsersByIds(ids)
}

io.on('connection', function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`)

    if (!socket.request.session || !socket.request.session.user) {
        return socket.disconnect(true)
    }
    const userId = socket.request.session.user.id

    const socketOnlineAlready = onlineUsers.some(user => user.userId === userId)

    if (!socketOnlineAlready) {
        onlineUsers.push({ userId, socketId: socket.id })

        db.getUserInfo(userId)
        .then(user => socket.broadcast.emit('userJoined', user))
    }

    Promise.all([
        getOnlineUsers(),
        db.getChatMessages()
    ])
    .then(([ onlineUsersObj, messages ]) => {
        socket.emit('onlineUsers', onlineUsersObj)
        socket.emit('chatMessages', messages)
    })

    socket.on('disconnect', () => {
        console.log(`socket with the id ${socket.id} is now disconnected`)

        const socketInList = onlineUsers.some(user => user.socketId === socket.id)

        if (socketInList) {
            onlineUsers = onlineUsers.filter(user => user.userId != userId)
            socket.broadcast.emit('userLeft', userId)
        }
    })

    socket.on('chatMessage', msg => {
        Promise.all([
            db.newChatMessage(msg.text, msg.userId),
            db.getUserInfo(msg.userId)
        ])
        .then(([ chatMsg, userInfo ]) => {
            console.log("msg",chatMsg, userInfo);
            const chatObj = Object.assign({}, chatMsg, {
                firstname: userInfo.firstname,
                lastname: userInfo.lastname,
                email: userInfo.email,
                username: userInfo.username,
                profilepic: userInfo.profilepic,
                msg_id: chatMsg.id
            })

            console.log(chatObj);

            io.sockets.emit('chatMessage', chatObj)
        })
    })
})

app.use('/', require('./friendships'))

app.post('/register-new-user', (req, res) => {
    const { firstname, lastname, username, email, password } = req.body

    if ( !firstname || !lastname || !email || !password  || !username) {
        res.json({
            success: false,
            error: "Please complete all fields before submitting."
        })
    } else {
        db.registerNewUser(firstname, lastname, username, email, password)
        .then(id => {
            req.session.user = { id, firstname, lastname, username, email }
            res.json({ success: true })
        })
        .catch(err => console.log("There was an error in POST /register-new-user", err) )
    }

})

app.post('/login-user', (req, res) => {
    const { email, password } = req.body
    db.loginUser(email, password)
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

app.post('/upload-image', uploader.single('file'), s3.upload, function(req, res) {
    if (req.file) {
        db.saveImage(req.file.filename, req.session.user.email)
        .then(function(image) {
            res.json({ success: true, image: req.file.filename })
        })
    } else {
        res.json({
            success: false,
            error: 'Something went wrong in upload-image'
        })
    }
})

app.get('/get-user-info', (req, res) => {
    db.getUserInfo(req.session.user.id)
    .then(userInfo => {
        res.json(userInfo)
    })
})

app.get('/get-other-user-info/:userId', (req, res) => {
    Promise.all([
        db.getUserInfo(req.params.userId),
        db.getFriendshipStatus(req.session.user.id, req.params.userId)
    ])
    .then(([ userInfo, friendshipStatus ]) => {
        const newObj = Object.assign({}, userInfo, {
            friendshipStatus: friendshipStatus.status,
            sender: friendshipStatus.sender,
            recipient: friendshipStatus.recipient
        })
        res.json(newObj)
    })
    .catch(e => console.log('There was an error in /get-other-user-info', e))
})

app.post('/newBio', (req, res) => {
    db.updateBio(req.body.bio, req.session.user.id)
    .then(() => {
        res.json({ success: true })
    })
})

app.get('/logout', (req, res) => {
    req.session = null
    res.redirect('/welcome/')
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
    if (!req.session.user) res.redirect('/welcome/')

    res.sendFile(__dirname + '/index.html')
})

server.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening on port 8080.")
})
