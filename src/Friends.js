import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFriends, updateFriendRequest } from './actions'
import { Link } from 'react-router-dom'


class Friends extends Component {
    constructor() {
        super()
        this.renderFriends = this.renderFriends.bind(this)
        this.renderPending = this.renderPending.bind(this)
    }

    componentDidMount() {
        this.props.dispatch(getFriends())
    }

    renderPending(pendingArray) {
        if (!pendingArray) {
            return (
                <div>Loading...</div>
            )
        }

        const { dispatch } = this.props

        return pendingArray.map((item, i) => {
            return (
                <div className="friends-card" key={ i }>

                    <div className="friends-card-top" >
                        <Link to={ `/user/${item.id}` }>
                            <img src={ item.profilepic || 'http://via.placeholder.com/100x100' } />
                        </Link>
                        <Link to={ `/user/${item.id}` } className="full-name">{ item.firstname } { item.lastname }</Link>
                    </div>

                    <div className="friends-card-bottom">
                        <button onClick={() => {
                                dispatch(updateFriendRequest(item.id, 'ACCEPT_FRIEND_REQUEST'))
                            }}>Accept</button>
                        <button onClick={() => {
                                dispatch(updateFriendRequest(item.id, 'REJECT_FRIEND_REQUEST'))
                            }}>Reject</button>
                    </div>
                </div>
            )
        })
    }

    renderFriends(friendsArray) {
        if (!friendsArray) {
            return (
                <div>Loading...</div>
            )
        }

        const { dispatch } = this.props

        return friendsArray.map((item, i) => {
            return (
                <div className="friends-card" key={ i }>

                    <div className="friends-card-top" >
                        <Link to={ `/user/${item.id}` }>
                            <img src={ item.profilepic || 'http://via.placeholder.com/100x100' } />
                        </Link>
                        <Link to={ `/user/${item.id}` } className="full-name">{ item.firstname } { item.lastname }</Link>
                    </div>

                </div>
            )
        })
    }

    render() {
        const { pendingFriends, currentFriends } = this.props

        return (
            <div className="page">
                <div id="pending-friends-container">
                    <h2>Pending Friend Requests</h2>
                    { this.renderPending(pendingFriends) }
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
    console.log(state);
    return {
        currentFriends: state.currentFriends,
        pendingFriends: state.pendingFriends
    }
}

export default connect(mapStateToProps)(Friends)
