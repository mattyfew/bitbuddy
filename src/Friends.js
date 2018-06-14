import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFriends, updateFriendRequest } from './actions'
import { Link } from 'react-router-dom'


class Friends extends Component {
    constructor() {
        super()

        this.renderFriends = this.renderFriends.bind(this)
    }

    componentDidMount() {
        this.props.dispatch(getFriends())
    }

    renderFriends(friendsArray) {

        if (!friendsArray) {
            return (
                <div>Loading...</div>
            )
        }

        return friendsArray.map((item, i) => {
            return (
                <div key={ i }>
                    <Link to={ `/user/${item.id}` }>{ item.firstname }</Link>
                    <br />
                    <button onClick={() => {
                            this.props.dispatch(updateFriendRequest(item.id, 'ACCEPT_FRIEND_REQUEST'))
                        }}>Accept</button>
                    <button onClick={() => {
                            this.props.dispatch(updateFriendRequest(item.id, 'REJECT_FRIEND_REQUEST'))
                        }}>Reject</button>
                </div>
            )
        })
    }

    render() {
        const { pendingFriends, currentFriends } = this.props

        return (
            <div>
                <h1>Friends</h1>

                <div id="pending-friends-container">
                    <h2>Pending Friend Requests</h2>
                    { this.renderFriends(pendingFriends) }
                </div>

                <div id="current-friends-container">
                    <h2>Current Friends</h2>
                    { this.renderFriends(currentFriends) }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        currentFriends: state.currentFriends,
        pendingFriends: state.pendingFriends
    }
}

export default connect(mapStateToProps)(Friends)
