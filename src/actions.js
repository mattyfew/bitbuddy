

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
