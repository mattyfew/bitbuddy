import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'


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
                    <Link to={ `/user/${ user.id }` }><p>{ user.firstname} { user.lastname }</p></Link>
                </div>
            )
        })
    }

    render() {
        return (
            <div className="page">
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
