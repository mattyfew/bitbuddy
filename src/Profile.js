import React, { Component } from 'react'

export default class Profile extends Component {
    constructor(props) {
        super(props)
    }



    render() {
        const { id, firstname, lastname, email, username, bio, imgUrl } = this.props.user
        return (
            <div>
                <h1>Profile</h1>
                <img id="banner" src="/coinbase.png" alt="coinbase" />
                <section id="profile-info">
                    <div className="profile-left">
                        {/* <img src={ imgUrl } alt={ username }/> */}
                        <img src="http://www.gjermundbjaanes.com/img/posts/blockchain/lisk_logo.jpg" alt=""/>
                    </div>

                    <div className="profile-right">
                        <p>First Name: { firstname }</p>
                        <p>Last Name: { lastname }</p>
                        <p>Email: { email }</p>
                        <p>Username: { username }</p>
                        <textarea name="bio" id="bio" cols="30" rows="10"
                            onChange={this.props.handleChange}
                            >
                            {this.props.bio}
                        </textarea>
                        <button onClick={this.props.submitEditBio}>Submit Changes</button>
                    </div>

                </section>

            </div>
        )
    }
}
