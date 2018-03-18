import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { getOtherUserInfo } from './actions'


class OtherProfile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            imgUrl: 'https://pbs.twimg.com/profile_images/794439847393902592/jWV9fy0R.jpg'
        }
    }

    componentDidMount() {
        console.log("running componentDidMount");
        const userId = this.props.match && this.props.match.params.userId
        this.setState({ userId })
        this.props.dispatch(getOtherUserInfo(userId))
    }

    componentDidUpdate(nextProps){
        const userId = this.props.match.params.userId;

        if (userId != this.state.userId){
            this.setState({ userId })
            this.componentDidMount()
        }
    }

    render() {
        if (!this.props.otherUser) {
            return (
                <div>Loading....</div>
            )
        }

        const { firstname, lastname, email, imgUrl, username } = this.props.otherUser

        return (
            <div>
                <h1>Other Profile</h1>

                <img src={ imgUrl } alt={ username }/>
                <p>First Name: { firstname }</p>
                <p>Last Name: { lastname }</p>
                <p>Email: { email }</p>
                <p>Username: { username }</p>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        otherUser: state.otherUser
    }
}

export default connect(mapStateToProps)(OtherProfile)
