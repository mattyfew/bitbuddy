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


exports.saveImage = function(filename, email) {
    return new Promise((resolve, reject) => {
        const q = `
            UPDATE users
            SET profilepic = $1
            WHERE email = $2
            RETURNING profilepic`
        const params = [ filename, email ]

        db.query(q, params)
        .then(results => {
            resolve(results.rows[0])
        })
        .catch(e => {
            console.log("There was an error in saveImage", e)
            reject(e)
        })
    })
}

exports.getUsersByIds = function(ids) {
    const q = `
        SELECT id, firstname, lastname, email, username, profilepic
        FROM users
        WHERE id = ANY($1)`
    const params = [ ids ]

    return db.query(q, params)
    .then(results => {
        return results.rows
    })
    .catch(e => {
        console.log("There was an error in getUsersByIds", e)
        reject(e)
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
                   AND (recipient_id = $2 OR sender_id = $2)
                   AND (status = 1 OR status = 2)`
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
                sender: (results.rows[0] && results.rows[0].sender) || null ,
                recipient: (results.rows[0] && results.rows[0].recipient) || null
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

exports.updateFriendRequest = function(userId, otherUserId, action) {
    return new Promise(function(resolve, reject) {

        switch (action) {
            case 'ACCEPT_FRIEND_REQUEST':
                status = 2
                break;
            case 'REJECT_FRIEND_REQUEST':
                status = 3
                break;
            case 'TERMINATE_FRIENDSHIP':
                status = 4
                break;
            case 'CANCEL_FRIEND_REQUEST':
                status = 5
                break;
        }

        const q = `
            UPDATE friendships
            SET status = $1
            WHERE (recipient_id = $2 OR sender_id = $2)
            AND (recipient_id = $3 OR sender_id = $3)`
        const params = [ status, userId, otherUserId ]

        db.query(q, params)
        .then(() => resolve())
        .catch(e => {
            console.log("There was an error in updateFriendRequest", e)
            reject(e)
        })
    })
}

exports.getFriends = function(userId) {
    return new Promise(function(resolve, reject) {
        const q = `
            SELECT users.id, firstname, lastname, profilepic, status, username
            FROM friendships
            JOIN users
            ON (status = 1 AND recipient_id = $1 AND sender_id = users.id)
            OR (status = 2 AND recipient_id = $1 AND sender_id = users.id)
            OR (status = 2 AND sender_id = $1 AND recipient_id = users.id)
        `
        const params = [ userId ]

        db.query(q, params)
        .then(results => resolve(results.rows))
        .catch(e => {
            console.log("There was an error in getFriends", e)
            reject(e)
        })

    })
}

// ==================================================================
//                           CHAT MESSAGES
// ==================================================================

exports.newChatMessage = function(text, authorId) {
    return new Promise(function(resolve, reject) {
        const q = `
            INSERT INTO chat_messages (text, author_id)
            VALUES ($1, $2)
            RETURNING *
        `
        const params = [ text, authorId ]

        db.query(q, params)
        .then(results => resolve(results.rows[0]))
        .catch(e => {
            console.log("There was an error in newChatMessage", e)
            reject(e)
        })
    })
}

exports.getChatMessages = function() {
    return new Promise(function(resolve, reject) {
        const q = `
            SELECT users.id AS author_id, users.firstname, users.lastname, users.email, users.username, users.profilepic,
                   chat_messages.id AS msg_id, chat_messages.text, chat_messages.created_at
            FROM chat_messages
            JOIN users
            ON chat_messages.author_id = users.id
        `

        db.query(q)
        .then(results => resolve(results.rows))
        .catch(e => {
            console.log("There was an error in getChatMessages", e)
            reject(e)
        })
    })
}
