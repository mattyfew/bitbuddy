const router = require('express').Router()
const db = require('./db/db')

router.post('/send-friend-request', (req, res) => {
    db.sendFriendRequest(req.session.user.id, req.body.otherUserId, req.body.oldStatus)
    .then(results => {
        res.json({
            success: true,
            sender: results.sender_id,
            recipient: results.recipient_id
        })
    })
})

router.post('/update-friend-request', (req, res) => {
    db.updateFriendRequest(req.session.user.id, req.body.otherUserId, req.body.action)
    .then(() => res.json({ success: true }) )
})

router.get('/get-friends', (req, res) => {
    db.getFriends(req.session.user.id)
    .then(friends => {
        res.json({ friends })
    })
})

module.exports = router
