const initState = {
    FRIEND_REQUEST_PENDING: 1,
    FRIEND_REQUEST_ACCEPTED: 2,
    FRIEND_REQUEST_REJECTED: 3,
    FRIEND_REQUEST_TERMINATED: 4,
    FRIEND_REQUEST_CANCELED: 5
};

export function reducer(state = {}, action) {
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
        const user = Object.assign({}, state.user, {
            bio: action.bio
        })
        return Object.assign({}, state, { user })
    }

    if (action.type == 'GET_OTHER_USER_INFO') {
        state = Object.assign({}, state, {
            otherUser: action.otherUser
        })
    }




    // FRIENDS
    // =======================================

    if (action.type == 'SEND_FRIEND_REQUEST') {
        const otherUser = Object.assign({}, state.otherUser, {
            friendshipStatus: 1
        })
        state = Object.assign({}, state, {})
    }

    if (action.type == 'ACCEPT_FRIEND_REQUEST') {
        state = Object.assign({}, state, {})
    }

    if (action.type == 'CANCEL_FRIEND_REQUEST') {
        state = Object.assign({}, state, {})
    }

    if (action.type == 'TERMINATE_FRIEND_REQUEST') {
        state = Object.assign({}, state, {})
    }






    // CHAT
    // =======================================

    if (action.type == 'CHAT_MESSAGES') {
        state = Object.assign({}, state, {
            chatMessages: action.messages
        })
    }

    if (action.type == 'CHAT_MESSAGE') {
        state = Object.assign({}, state, {
            chatMessages: [ ...state.chatMessages, action.message ]
        })
    }

    return state;
}
