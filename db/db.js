const auth = require('./auth')
const spicedPg = require('spiced-pg');
const secrets = require('./secrets.json')
const db = spicedPg(`postgres:${secrets.dbUser}:${secrets.dbPassword}@localhost:5432/social_network`);

exports.registerNewUser = function(firstname, lastname, username, email, password) {
    return new Promise (( resolve, reject) => {
        auth.hashPassword(password)
            .then(hashedPassword => {
                const q = `
                    INSERT INTO users
                    (firstname, lastname, username, email, password)
                    VALUES
                    ($1, $2, $3, $4, $5)
                    RETURNING *
                `
                const params = [ firstname, lastname, username, email, hashedPassword ]

                return db.query(q, params)
                    .then(results => resolve(results.rows[0]) )
                    .catch(err => console.log("There was an error in registerNewUser", err) )
        })
    })
}

exports.loginUser = function(email, plainTextPassword) {
    return new Promise (( resolve, reject) => {

        checkForEmailAndGetPassword(email)
            .then(results => {
                console.log("we in here", results);
                if (!results.emailExists) {
                    reject({ errorMessage: "email does not exist" })
                } else {
                    auth.checkPassword(plainTextPassword, results.hashPassword)
                        .then(doesMatch => {
                            if (doesMatch) {

                            }
                    })
                }
            })
    })
}

function checkForEmailAndGetUserInfo(email) {
    return new Promise (( resolve, reject) => {
        const q = `SELECT * FROM users WHERE email = $1`
        const params = [ email ]

        db.query(q, params)
            .then(results => {
                if (results.rows[0]) {
                    console.log("there is an existing email", results.rows)
                    resolve({
                        emailExists: true,
                        hashPassword: password
                    })
                } else {
                    console.log("there isn't an email", results.rows);
                    resolve({
                        emailExists: false
                    })
                }
            })
    })
}
