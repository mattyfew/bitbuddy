import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFriends } from './actions'

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
                <div key={i}>{ item.firstname }</div>
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
    console.log("mapStateToProps", state);
    return {
        currentFriends: state.currentFriends,
        pendingFriends: state.pendingFriends
    }
}

export default connect(mapStateToProps)(Friends)
