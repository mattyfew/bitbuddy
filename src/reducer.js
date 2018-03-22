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




    // FRIENDS REDUCER
    // =======================================

    if (action.type == 'SEND_FRIEND_REQUEST') {
        console.log("inside SEND_FRIEND_REQUEST");
        const otherUser = Object.assign({}, state.otherUser, {
            friendshipStatus: 1,
            sender: action.sender,
            recipient: action.recipient
        })
        state = Object.assign({}, state, { otherUser })
    }

    if (action.type == 'ACCEPT_FRIEND_REQUEST') {
        const otherUser = Object.assign({}, state.otherUser, {
            friendshipStatus: 2
        })
        state = Object.assign({}, state, { otherUser })
    }

    if (action.type == 'REJECT_FRIEND_REQUEST') {
        state = Object.assign({}, state, {
            otherUser: resetOtherUserFriendshipInfo(state)
        })
    }

    if (action.type == 'TERMINATE_FRIEND_REQUEST') {
        state = Object.assign({}, state, {
            otherUser: resetOtherUserFriendshipInfo(state)
        })
    }

    if (action.type == 'CANCEL_FRIEND_REQUEST') {
        state = Object.assign({}, state, {
            otherUser: resetOtherUserFriendshipInfo(state)
        })
    }

    if (action.type == 'GET_FRIENDS') {
        const pendingFriends = action.friends.filter(item => item.status === 1)
        const currentFriends = action.friends.filter(item => item.status === 2)
        console.log("in reducer GET_FRIENDS", pendingFriends);

        state = Object.assign({}, state, {
            pendingFriends,
            currentFriends
        })
    }





    // CHAT
    // =======================================

    if (action.type == 'CHAT_MESSAGES') {
        state = Object.assign({}, state, { chatMessages: action.messages })
    }

    if (action.type == 'CHAT_MESSAGE') {
        state = Object.assign({}, state, {
            chatMessages: [ ...state.chatMessages, action.message ]
        })
    }

    return state;
}

function resetOtherUserFriendshipInfo({ otherUser }) {
    return Object.assign({}, otherUser, {
        friendshipStatus: 0,
        sender: null,
        recipient: null
    })
}
