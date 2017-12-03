const express = require('express')
const app = express()
const compression = require('compression')
const bodyParser = require('body-parser')
const multer = require('multer')
const db = require('./db/db')

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

app.use(express.static('./public'))

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
})

app.get('*', function(req, res){
    res.sendFile(__dirname + '/index.html')
})

app.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening on port 8080.")
})
