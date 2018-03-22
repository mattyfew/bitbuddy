import axios from 'axios'
import { push } from 'react-router-redux'

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
    console.log("running action uploadImage");
    return axios.post('/uploadImage', file)
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

export function acceptFriendRequest(otherUserId) {
    return axios.post('/accept-friend-request', { action: 'ACCEPT_FRIEND_REQUEST', otherUserId })
        .then(() => {
            return {
                type: 'ACCEPT_FRIEND_REQUEST'
            }
        })
}

export function cancelFriendRequest(otherUserId) {
    return axios.post('/cancel-friend-request', { action: 'CANCEL_FRIEND_REQUEST', otherUserId })
        .then(() => {
            return {
                type: 'CANCEL_FRIEND_REQUEST'
            }
        })
}

export function rejectFriendRequest(otherUserId) {
    return axios.post('/reject-friend-request', { action: 'REJECT_FRIEND_REQUEST', otherUserId })
        .then(() => {
            return {
                type: 'REJECT_FRIEND_REQUEST'
            }
        })
}

export function terminateFriendship(otherUserId) {
    return axios.post('/terminate-friendship', { action: 'TERMINATE_FRIENDSHIP', otherUserId })
        .then(() => {
            return {
                type: 'TERMINATE_FRIEND_REQUEST',
            }
        })
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

export function chatMessage (message) {
    return {
        type: 'CHAT_MESSAGE',
        message
    }
}
