const express = require('express')
const app = express()
const compression = require('compression')
const csurf = require('csurf')

app.use(compression())
app.use(csurf())

app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken())
    next()
})

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    )
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`))
}


io.on('connection', function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`)
    // const session = getSessionFromSocket(socket, { secret: 'raisins', })
    //
    // if (!session || !session.user) { return socket.disconnect(true); }
    //
    // // some() returns a boolean based on if one of the elements in the
    // // array passes the condition specified in the callback.
    // // we use it here to check if the socket.id is already in the list of
    // // online users, we don't want them to go any farther
    // if (onlineUsers.some(item => item.socketId == socket.id)) { return }
    //
    // const userId = session.user.id;
    //
    // socket.emit('chats', messages)
    //
    // onlineUsers.push({
    //     id: session.user.id,
    //     socketId: socket.id
    // })
    //
    socket.on('disconnect', () => {
        console.log(`socket with the id ${socket.id} is now disconnected`)
    })

    socket.emit('test', 'this is just a test')
    //
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





app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

app.listen(8080, function() {
    console.log("I'm listening on port 8080")
})
