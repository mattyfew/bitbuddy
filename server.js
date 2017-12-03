const express = require('express')
const app = express()
const compression = require('compression')
const bodyParser = require('body-parser')
const db = require('./db/db')

app.use(compression())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

if (process.env.NODE_ENV != 'production') {
    app.use('/bundle.js', require('http-proxy-middleware')({
        target: 'http://localhost:8081/'
    }))
}

app.use(express.static('./public'))

app.post('/register-new-user', (req, res) => {
    console.log("in POST /register-new-user", req.body)
    const { firstname, lastname, username, email, password } = req.body

    db.registerNewUser(firstname, lastname, username, email, password)
        .then(() => {
            console.log("in the then!!!");
        })
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
