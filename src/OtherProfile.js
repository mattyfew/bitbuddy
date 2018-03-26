import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { getOtherUserInfo } from './actions'
import FriendButton from './FriendButton'

class OtherProfile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            imgUrl: 'https://pbs.twimg.com/profile_images/794439847393902592/jWV9fy0R.jpg'
        }
    }

    componentDidMount() {
        const userId = this.props.match && this.props.match.params.userId
        this.setState({ userId: parseInt(userId) }, () => {
            if (this.state.userId === this.props.user.id) {
                this.props.history.push('/')
            }
            this.props.dispatch(getOtherUserInfo(userId))
        })
    }

    componentDidUpdate(nextProps){
        const userId = this.props.match.params.userId

        if (userId != this.state.userId){
            this.setState({ userId })
            this.componentDidMount()
        }
    }

    render() {
        console.log(this.props);
        if (!this.props.otherUser) {
            return (
                <div>Loading....</div>
            )
        }

        const { otherUser: {
            id, firstname, lastname, email, imgUrl, username, bio, friendshipStatus, sender, recipient
        }, user, dispatch } = this.props

        return (
            <div>
                <h1>Other Profile</h1>
                <section id="profile-info">
                    <div className="profile-left">
                        <h2>{username}</h2>
                        <img src="http://www.gjermundbjaanes.com/img/posts/blockchain/lisk_logo.jpg" alt="profile-pic"/>
                        <FriendButton
                            userId={ user.id }
                            otherUserId={ id }
                            friendshipStatus={ friendshipStatus }
                            sender={ sender }
                            recipient={ recipient }
                            dispatch={ dispatch }
                        />
                    </div>

                    <div className="profile-right">
                        <p>First Name: { firstname }</p>
                        <p>Last Name: { lastname }</p>
                        <p>Email: { email }</p>
                        <p>Username: { username }</p>
                        <p>Bio: { bio }</p>
                    </div>
                </section>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        otherUser: state.otherUser
    }
}

export default connect(mapStateToProps)(withRouter(OtherProfile))
