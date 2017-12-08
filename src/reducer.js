const initState = {
    FRIEND_REQUEST_PENDING: 1,
    FRIEND_REQUEST_ACCEPTED: 2,
    FRIEND_REQUEST_REJECTED: 3,
    FRIEND_REQUEST_TERMINATED: 4,
    FRIEND_REQUEST_CANCELED: 5
};

export function reducer(state = {}, action) {
    console.log("running reducer", action.type);

    if (action.type == 'GET_USER_INFO') {
        return Object.assign({}, state, {
            user: action.user
        })
    }

    if (action.type == 'SHOW_BIO_EDITOR') {
        return Object.assign({}, state, {
            bioEditorIsVisible: true
        })
    }

    if (action.type == 'UPLOAD_IMAGE') {
        return Object.assign({}, state, {

        })
    }

    if (action.type == 'UPDATE_BIO') {
        console.log("reducer UPDATE_BIO");
        const user = Object.assign({}, state.user, {
            bio: action.bio
        })
        return Object.assign({}, state, { user });
    }
    return state;
}
