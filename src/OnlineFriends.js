import React, { Component } from 'react'
import { connect } from 'react-redux'

class OnlineFriends extends Component {
    constructor() {
        super()
        this.renderFriends = this.renderFriends.bind(this)
    }

    renderFriends() {
        if (!this.props.onlineUsers) {
            return (<div>Loading...</div>)
        }

        return this.props.onlineUsers.map(user => {
            return (
                <div className="online-user" key={ user.id }>
                    <p>{ user.firstname} { user.lastname }</p>
                </div>
            )
        })
    }

    render() {
        return (
            <div>
                <h1>OnlineFriends</h1>

                <div className="online-friends-container">
                    { this.renderFriends() }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        onlineUsers: state.onlineUsers
    }
}

export default connect(mapStateToProps)(OnlineFriends)
