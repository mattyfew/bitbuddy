const auth = require('./auth')
const spicedPg = require('spiced-pg');
const secrets = require('./secrets.json')
const db = spicedPg(`postgres:${secrets.dbUser}:${secrets.dbPassword}@localhost:5432/social_network`);

exports.registerNewUser = function(firstname, lastname, username, email, password) {
    console.log("running registerNewUser");

    const q = `
        INSERT INTO users
        (firstname, lastname, username, email, password)
        VALUES
        ($1, $2, $3, $4, $5)
    `
    const params = [ firstname, lastname, username, email, password ]

    return db.query(q, params)
        .catch(err => console.log("There was an error in registerNewUser", err) )


}

exports.loginUser = function(email, password) {
    console.log("running loginUser");
    const q = ''
    const params = []
}
