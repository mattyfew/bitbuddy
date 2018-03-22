import React, { Component } from 'react'
import {
    sendFriendRequest, acceptFriendRequest, cancelFriendRequest, rejectFriendRequest, terminateFriendship
} from './actions'

export default class FriendButton extends Component {
    constructor(props) {
        super(props)
        this.state = { showRecipientButtons: false }

        this.renderButton = this.renderButton.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        if (this.props.recipient === this.props.userId && this.props.friendshipStatus === 1) {
            this.setState({ showRecipientButtons: true })
        }
    }

    handleClick(str) {
        const { dispatch, friendshipStatus, userId, otherUserId, sender, recipient } = this.props
        const { showRecipientButtons } = this.state

        switch (friendshipStatus) {
            case 0: // null
                dispatch(sendFriendRequest(otherUserId, friendshipStatus))
                break;
            case 1: // pending
                if (showRecipientButtons) {
                    if (str === 'reject') {
                        console.log("REJECTING!");
                        dispatch(rejectFriendRequest(otherUserId))
                        this.setState({ showRecipientButtons: false })
                    } else if (str === 'accept') {
                        console.log("ACCEPTING!");
                        dispatch(acceptFriendRequest(otherUserId))
                        this.setState({ showRecipientButtons: false })
                    }
                } else {
                    if (sender === userId) {
                        console.log("CANCELLING!");
                        dispatch(cancelFriendRequest(otherUserId))
                    }
                }
                break;
            case 2: // accepted
                dispatch(terminateFriendship(otherUserId))
                break;
            case 3: // rejected
                dispatch(sendFriendRequest(otherUserId, friendshipStatus))
                break;
            case 4: // terminated
                dispatch(sendFriendRequest(otherUserId, friendshipStatus))
                break;
            case 5: // cancelled
                dispatch(sendFriendRequest(otherUserId, friendshipStatus))
                break;
        }
    }

    renderButton() {
        const { sender, recipient, userId, otherUserId, friendshipStatus } = this.props
        const { showRecipientButtons } = this.state
        let text

        console.log("rendering button", friendshipStatus, sender, recipient)

        switch (friendshipStatus) {
            case 0: // null
                text = 'Make Friend Request'
                break;
            case 1: // pending
                if (sender === userId) {
                    text = 'Cancel Friend Request'
                } else if (recipient === userId) {
                    // this.setState({ showRecipientButtons: true })
                }
                break;
            case 2: // accepted
                console.log("inside case 2, should say Terminate Friendship", this.state);
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
        }

        return (
            <div>
                { showRecipientButtons &&
                    <div>
                        <button onClick={ () => this.handleClick("reject") }>Reject</button>
                        <button onClick={ () => this.handleClick("accept") }>Accept</button>
                    </div>
                }

                { !showRecipientButtons &&
                    <button onClick={ () => this.handleClick() }>{ text }</button>
                }
            </div>
        )
    }

    render() {
        return this.renderButton()
    }
}
