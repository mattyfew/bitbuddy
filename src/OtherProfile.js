import React, { Component } from 'react'
import axios from 'axios'

export default class OtherProfile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            imgUrl: 'https://pbs.twimg.com/profile_images/794439847393902592/jWV9fy0R.jpg'
        }
    }

    componentDidMount() {
        axios.get(`/get-other-user-info/${this.props.params.userId}`)
            .then(({ data: { firstname, lastname, email, username, id } }) => {
                this.setState({ firstname, lastname, email, username, id })
            })
    }

    render() {
        if (!this.state.username) {
            return (
                <div>Loading....</div>
            )
        }
        return (
            <div>
                <h1>Other Profile</h1>

                <img src={this.state.imgUrl} alt={this.state.username}/>
                <p>First Name: {this.state.firstname}</p>
                <p>Last Name: {this.state.lastname}</p>
                <p>Email: {this.state.email}</p>
                <p>Username: {this.state.username}</p>
            </div>
        )
    }
}
