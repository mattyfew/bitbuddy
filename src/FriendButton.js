import React, { Component } from 'react'
import {
    sendFriendRequest, acceptFriendRequest, cancelFriendRequest, terminateFriendship
} from './actions'

export default class FriendButton extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showCancelAndAccept: false
        }

        this.renderButton = this.renderButton.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(str) {
        const { dispatch, friendshipStatus, userId, otherUserId } = this.props

        switch (friendshipStatus) {
            case 0: // null
                dispatch(sendFriendRequest(otherUserId, friendshipStatus))
                break;
            case 1: // pending
                if (str === 'cancel') {
                    console.log("CANCELLING!");
                    dispatch(cancelFriendRequest(otherUserId))
                } else {
                    console.log("ACCEPTING!");
                    dispatch(acceptFriendRequest(otherUserId))
                }
                break;
            case 2: // accepted
                dispatch(terminateFriendship(otherUserId))
                break;
            case 3: // rejected
                break;
            case 4: // terminated
                break;
            case 5: // cancelled
                dispatch(sendFriendRequest(otherUserId, friendshipStatus))
                break;
            default:
        }
    }

    renderButton() {
        const { sender, recipient, userId, otherUserId, friendshipStatus } = this.props
        let text, showBothButtons = false;

        switch (friendshipStatus) {
            case 0: // null
                text = 'Make Friend Request'
                break;
            case 1: // pending
                if (sender === userId) {
                    text = 'Cancel Friend Request'
                } else if (recipient === userId) {
                    text = 'Accept Friend Request'
                    showBothButtons = true
                }
                break;
            case 2: // accepted
                text = 'Terminate Friendship'
                break;
            case 3: // rejected
                text = 'Make Friend Request'
                break;
            case 4: // terminated
                text = 'Make Friend Request'
                break;
            case 5: // cancelled
                text = 'Make Friend Request'
                break;
            default:
                text = 'Make Friend Request'
        }

        return (
            <div>
                { showBothButtons && <button onClick={ () => {
                    this.handleClick("cancel")
                }}>Cancel</button> }
                <button onClick={ this.handleClick }>{ text }</button>
            </div>
        )
    }

    render() {
        return (
            <div>
                { this.renderButton() }
            </div>
        )
    }
}
