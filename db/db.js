const auth = require('./auth')
const spicedPg = require('spiced-pg');
const secrets = require('../secrets.json')
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

        checkForEmailAndGetUserInfo(email)
            .then(({ userInfo, emailExists }) => {
                if (!emailExists) {
                    reject({ errorMessage: "email does not exist" })
                } else {
                    auth.checkPassword(plainTextPassword, userInfo.password)
                        .then(doesMatch => {
                            if (doesMatch) {
                                resolve(userInfo)
                            } else {
                                reject({ errorMessage: 'That is not the right password' })
                            }
                    })
                }
            })
    })
}

function checkForEmailAndGetUserInfo(email) {
    return new Promise ( (resolve, reject) => {
        const q = `SELECT * FROM users WHERE email = $1`
        const params = [ email ]

        db.query(q, params)
            .then(results => {

                // NEED TO REFACTOR THIS LOGIC!
                if (results.rows[0]) {
                    console.log("there is an existing email")
                    resolve({
                        emailExists: true,
                        userInfo: results.rows[0]
                    })
                } else {
                    console.log("there isn't an email");
                    resolve({
                        emailExists: false
                    })
                }
            })
            .catch(err => {
                console.log("Something went wrong in checkForEmailAndGetUserInfo", err);
            })
    })
}

exports.getUserInfo = function(userId) {
    return new Promise( (resolve, reject) => {
        const q = `SELECT * FROM users WHERE id = $1`
        const params = [ userId ]

        db.query(q, params)
            .then(({ rows }) => resolve(rows[0]))
    })
}


exports.saveImage = function(image, email) {
    const q = 'UPDATE users SET profilepic = $1 WHERE email = $2 RETURNING profilepic'
    const params = [ image, email ]
    return db.query(q, params).then(function(results) {
        // results.rows.forEach(function(row) {
        //     row.profilepic = config.s3Url + row.profilepic;
        // })
        return results.rows[0]
    })
}
