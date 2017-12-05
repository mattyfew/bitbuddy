import React, { Component } from 'react'

export default class Profile extends Component {
    constructor(props) {
        super(props)
    }



    render() {
        return (
            <div>
                <h1>Profile</h1>

                <img src={this.props.user.imgUrl} alt={this.props.user.username}/>
                <p>First Name: {this.props.user.firstname}</p>
                <p>Last Name: {this.props.user.lastname}</p>
                <p>Email: {this.props.user.email}</p>
                <p>Username: {this.props.user.username}</p>

                <textarea name="bio" id="bio" cols="30" rows="10"
                    onChange={this.props.handleChange}
                    >
                    {this.props.bio}
                </textarea>

                <button onClick={this.props.submitEditBio}>Submit Changes</button>
            </div>
        )
    }
}
