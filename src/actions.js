import axios from 'axios'

export function getUserInfo() {
    return axios.get('/get-user-info')
        .then( user => {
            return {
                type: 'GET_USER_INFO',
                user: user.data
            }
        })
}

export function getOtherUserInfo(userId) {
    return axios.get(`/get-other-user-info/${userId}`)
        .then(res => {
            return {
                type: 'GET_OTHER_USER_INFO',
                otherUser: res.data
            }
        })
}

export function uploadImage(file) {
    return axios.post('/upload-image', file)
        .then( ({ data }) => {
            return {
                type: 'UPLOAD_IMAGE'
            }
        })
}

export function updateBio(bio) {
    return axios.post('/newBio', { bio })
        .then(() => {
            return {
                type: 'UPDATE_BIO',
                bio
            }
        })
}




// FRIENDS ACTIONS
// =======================================

export function sendFriendRequest(otherUserId, oldStatus) {
    return axios.post('/send-friend-request', { action: 'SEND_FRIEND_REQUEST', otherUserId, oldStatus })
        .then(resp => {
            return {
                type: 'SEND_FRIEND_REQUEST',
                sender: resp.data.sender,
                recipient: resp.data.recipient
            }
        })
}

export function updateFriendRequest(otherUserId, action) {
    return axios.post('/update-friend-request', { action, otherUserId })
        .then(() => ({ type: action }))
}

export function getFriends() {
    return axios.get('/get-friends')
        .then(resp => {
            return {
                type: 'GET_FRIENDS',
                friends: resp.data.friends
            }
        })
}




// ONLINE USERS
// =======================================

export function onlineUsers(users) {
    return {
        type: 'ONLINE_USERS',
        users
    }
}

export function userJoined(user) {
    return {
        type: 'USER_JOINED',
        user
    }
}

export function userLeft(userId) {
    return {
        type: 'USER_LEFT',
        userId
    }
}




// CHAT
// =======================================

export function fetchFriends() {
    return {
        type: 'FETCH_FRIENDS'
    }
}

export function chatMessages (messages) {
    return {
        type: 'CHAT_MESSAGES',
        messages
    }
}

export function chatMessage (msgData) {
    return {
        type: 'CHAT_MESSAGE',
        msgData
    }
}
