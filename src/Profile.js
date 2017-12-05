import React, { Component } from 'react'

export default class Profile extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <h1>Profile</h1>

                <p>First Name: {this.props.firstname}</p>
                <p>Last Name: {this.props.lastname}</p>
                <p>Email: {this.props.email}</p>
                <p>Username: {this.props.username}</p>
            </div>
        )
    }
}
