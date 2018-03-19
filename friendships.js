const router = require('express').Router()
const db = require('./db/db')

router.post('/send-friend-request', (req, res) => {
    db.sendFriendRequest(req.session.user.id, req.body.otherUserId, req.body.oldStatus)
    .then(() => {
        res.json({ success: true })
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

router.post('/terminate-friendship', (req, res) => {
    db.terminateFriendship(req.session.user.id, req.body.otherUserId)
    .then(() => {
        res.json({ success: true })
    })
})

module.exports = router
