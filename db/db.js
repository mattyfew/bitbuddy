const auth = require('./auth')
const spicedPg = require('spiced-pg');
const secrets = require('../secrets.json')
const db = spicedPg(`postgres:${secrets.dbUser}:${secrets.dbPassword}@localhost:5432/bitbuddy`)

exports.registerNewUser = function(firstname, lastname, username, email, password) {
    return new Promise ((resolve, reject) => {
        auth.hashPassword(password)
        .then(hashedPassword => {
            const q = `
                INSERT INTO users
                (firstname, lastname, username, email, password)
                VALUES
                ($1, $2, $3, $4, $5)
                RETURNING id`
            const params = [ firstname, lastname, username, email, hashedPassword ]

            db.query(q, params)
            .then(results => resolve(results.rows[0].id))
            .catch(err => console.log("There was an error in registerNewUser", err) )
        })
    })
}

exports.loginUser = function(email, plainTextPassword) {
    return new Promise ((resolve, reject) => {
        checkForEmailAndGetUserInfo(email)
        .then(({ userInfo, emailExists }) => {
            if (!emailExists) {
                reject({ errorMessage: "Email does not exist" })
            } else {
                auth.checkPassword(plainTextPassword, userInfo.password)
                .then(doesMatch => {
                    doesMatch
                        ? resolve(userInfo)
                        : reject({ errorMessage: 'That is not the right password' })
                })
            }
        })
    })
}

function checkForEmailAndGetUserInfo(email) {
    return new Promise ((resolve, reject) => {
        const q = `SELECT * FROM users WHERE email = $1`
        const params = [ email ]

        db.query(q, params)
        .then(results => {
            const userInfo = results.rows[0]

            userInfo
                ? resolve({ emailExists: true, userInfo })
                : resolve({ emailExists: false })
        })
        .catch(e => {
            console.log("Something went wrong in checkForEmailAndGetUserInfo", e)
            reject(e)
        })
    })
}

exports.getUserInfo = function(userId) {
    return new Promise( (resolve, reject) => {
        const q = `SELECT id, firstname, lastname, email, username, profilepic, bio FROM users WHERE id = $1`
        const params = [ userId ]

        db.query(q, params)
        .then(results => resolve(results.rows[0]))
        .catch(e => {
            console.log("There was an error in getUserInfo", e)
            reject(e)
        })
    })
}


exports.saveImage = function(image, email) {
    return new Promise((resolve, reject) => {
        const q = 'UPDATE users SET profilepic = $1 WHERE email = $2 RETURNING profilepic'
        const params = [ image, email ]

        db.query(q, params)
        .then(results => {
            // results.rows.forEach(function(row) {
            //     row.profilepic = config.s3Url + row.profilepic;
            // })
            resolve(results.rows[0])
        })
        .catch(e => {
            console.log("There was an error in saveImage", e)
            reject(e)
        })
    })
}

exports.getUsersByIds = function(ids) {
    return new Promise((resolve, reject) => {
        const q = `
            SELECT id, firstname, lastname, email, username, profilepic
            FROM users
            WHERE id = ANY($1)`
        const params = [ ids ]

        db.query(q, params)
        .then(results => resolve(results.rows))
        .catch(e => {
            console.log("There was an error in getUsersByIds", e)
            reject(e)
        })
    })
}

exports.updateBio = function(bio, userId) {
    return new Promise(function(resolve, reject) {
        const q = 'UPDATE users SET bio = $1 WHERE id = $2'
        const params = [ bio, userId ]

        db.query(q, params)
        .then(() => resolve())
        .catch(e => {
            console.log("There was an error in updateBio", e)
            reject(e)
        })
    })
}



// FRIENDSHIPS

const PENDING = 1, ACCEPTED = 2, REJECTED = 3, TERMINATED = 4, CANCELED = 5;

exports.getFriendshipStatus = function(userId, otherUserId) {
    return new Promise((resolve, reject) => {

        const q = `SELECT status, sender_id AS sender, recipient_id AS recipient
                   FROM friendships
                   WHERE (recipient_id = $1 OR sender_id = $1)
                   AND (recipient_id = $2 OR sender_id = $2)`
        const params = [ userId, otherUserId ]

        db.query(q, params)
        .then(results => {
            let status
            if (!results.rows.length) {
                status = 0
            } else {
                status = results.rows[0].status
            }
            resolve({
                status,
                sender: results.rows[0].sender,
                recipient: results.rows[0].recipient
            })
        })
        .catch(e => {
            console.log("There was an error in getFriendshipStatus", e)
            reject(e)
        })
    })
}

exports.sendFriendRequest = function(userId, otherUserId, oldStatus) {
    return new Promise(function(resolve, reject) {
        let q

        // TODO: REFACTOR this

        if (oldStatus == 0) {
            q = `
                INSERT INTO friendships
                (status, sender_id, recipient_id)
                VALUES ($1, $2, $3)
                RETURNING *`
        } else if (oldStatus == 3) { // rejected
            q = `
                UPDATE friendships
                SET status = $1
                WHERE (recipient_id = $2 OR sender_id = $2)
                AND (recipient_id = $3 OR sender_id = $3)
                RETURNING *`
        } else if (oldStatus == 4) { // terminated
            q = `
                UPDATE friendships
                SET status = $1
                WHERE (recipient_id = $2 OR sender_id = $2)
                AND (recipient_id = $3 OR sender_id = $3)
                RETURNING *`
        } else if (oldStatus == 5) { // cancelled
            q = `
                UPDATE friendships
                SET status = $1
                WHERE (recipient_id = $2 OR sender_id = $2)
                AND (recipient_id = $3 OR sender_id = $3)
                RETURNING *`
        }

        const params = [ 1, userId, otherUserId ]
        db.query(q, params)
        .then(results => resolve(results.rows[0]))
        .catch(e => {
            console.log("There was an error in sendFriendRequest", e)
            reject(e)
        })
    })
}

exports.acceptFriendRequest = function(userId, otherUserId) {
    return new Promise(function(resolve, reject) {
        const q = `
            UPDATE friendships
            SET status = $1
            WHERE (recipient_id = $2 OR sender_id = $2)
            AND (recipient_id = $3 OR sender_id = $3)`
        const params = [ 2, userId, otherUserId ]

        db.query(q, params)
        .then(() => resolve())
        .catch(e => {
            console.log("There was an error in acceptFriendRequest", e)
            reject(e)
        })
    })
}

exports.cancelFriendRequest = function(userId, otherUserId) {
    return new Promise(function(resolve, reject) {
        const q = `
            UPDATE friendships
            SET status = $1
            WHERE (recipient_id = $2 OR sender_id = $2)
            AND (recipient_id = $3 OR sender_id = $3)
        `
        const params = [ 5, userId, otherUserId ]

        db.query(q, params)
        .then(() => resolve())
        .catch(e => {
            console.log("There was an error in cancelFriendRequest", e)
            reject(e)
        })
    })
}

exports.rejectFriendRequest = function(userId, otherUserId) {
    return new Promise(function(resolve, reject) {
        const q = `
            UPDATE friendships
            SET status = $1
            WHERE (recipient_id = $2 OR sender_id = $2)
            AND (recipient_id = $3 OR sender_id = $3)
        `
        const params = [ 3, userId, otherUserId ]

        db.query(q, params)
        .then(() => resolve())
        .catch(e => {
            console.log("There was an error in cancelFriendRequest", e)
            reject(e)
        })
    })
}

exports.terminateFriendship = function(userId, otherUserId) {
    return new Promise(function(resolve, reject) {
        const q = `
            UPDATE friendships
            SET status = $1
            WHERE (recipient_id = $2 OR sender_id = $2)
            AND (recipient_id = $3 OR sender_id = $3)
        `
        const params = [ 4, userId, otherUserId ]

        db.query(q, params)
        .then(() => resolve())
        .catch(e => {
            console.log("There was an error in terminateFriendship", e)
            reject(e)
        })
    })
}
