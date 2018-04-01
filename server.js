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

let onlineUsers = [], messages = [];

messages = [
    {
        id: 1,
        text: 'chatchatchatchatchatchat'
    }
]

const getOnlineUsers = () => {
    let ids = onlineUsers.map(user => user.userId)

    ids = ids.filter((id, i) =>  {
        return ids.indexOf(id) == i
    })
    return db.getUsersByIds(ids)
}

io.on('connection', function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`)
    if (!socket.request.session || !socket.request.session.user) {
        return socket.disconnect(true);
    }
    const userId = socket.request.session.user.id

    onlineUsers.push({
        userId,
        socketId: socket.id
    })

    getOnlineUsers()
    .then(onlineUsersObj => {
        socket.emit('onlineUsers', onlineUsersObj)
        socket.emit('chatMessages', messages)
    })

    db.getUserInfo(userId)
    .then(user => {
        socket.emit('userJoined', user)
    })

    socket.on('disconnect', () => {
        console.log(`socket with the id ${socket.id} is now disconnected`)

        onlineUsers = onlineUsers.filter(user => {
            return user.userId != userId
        })

        console.log("newOnlineUsers", onlineUsers)
        socket.broadcast.emit('userLeft', userId)
    })

    socket.on('chatMessage', msg => {

        console.log("inside chatMessage whatup", msg);

    })

    // some() returns a boolean based on if one of the elements in the
    // array passes the condition specified in the callback.
    // we use it here to check if the socket.id is already in the list of
    // online users, we don't want them to go any farther
    // if (onlineUsers.some(item => item.socketId == socket.id)) { return }


    // socket.emit('chats', messages)

    // socket.on('chat', msg => {
    //     const sender = onlineUsers.find(user => user.socketId == socket.id)
    //
    //     db.getUsersByIds([ sender.id ]).then(([data]) => {
    //         let singleChatMessage = data
    //         singleChatMessage.message = msg.message
    //         singleChatMessage.timestamp = new Date().toLocaleString()
    //         messages.push(singleChatMessage)
    //         messages = messages.slice(-10) // limits to just 10 messages
    //         io.sockets.emit('chat', singleChatMessage)
    //     })
    // })
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
            console.log("in here", id);
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
        console.log("otherUser data: ", newObj)
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
    res.sendFile(__dirname + '/index.html')
})

server.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening on port 8080.")
})
