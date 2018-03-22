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

router.post('/accept-friend-request', (req, res) => {
    db.acceptFriendRequest(req.session.user.id, req.body.otherUserId)
    .then(() => {
        res.json({ succes: true })
    })

})

router.post('/cancel-friend-request', (req, res) => {
    db.cancelFriendRequest(req.session.user.id, req.body.otherUserId)
    .then(() => {
        res.json({ success: true })
    })
})

router.post('/reject-friend-request', (req, res) => {
    db.rejectFriendRequest(req.session.user.id, req.body.otherUserId)
    .then(() => {
        res.json({ success: true })
    })
})

router.post('/terminate-friendship', (req, res) => {
    db.terminateFriendship(req.session.user.id, req.body.otherUserId)
    .then(() => {
        res.json({ success: true })
    })
})

router.get('/get-friends', (req, res) => {
    console.log("inside get-friends");
    db.getFriends(req.session.user.id)
    .then(friends => {
        console.log("results from getFriends", friends)
        res.json({ friends })
    })
})

module.exports = router
