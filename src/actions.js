import axios from 'axios'

export function getUserInfo() {
    return axios.get('/get-user-info')
        .then( ({ data }) => {
            return {
                type: 'GET_USER_INFO',
                user: data
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
    return {
        type: 'UPDATE_BIO',
        bio: bio
    }
}

export function fetchFriends() {
    return {
        type: 'FETCH_FRIENDS'
    }
}
