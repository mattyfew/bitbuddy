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

export function getOtherUserInfo() {

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
