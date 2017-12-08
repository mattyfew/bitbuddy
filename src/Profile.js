import React, { Component } from 'react'
import { connect } from 'react-redux'

class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showUploadImage: false
        }

        this.toggleShowUploadImage = this.toggleShowUploadImage.bind(this)
    }

    toggleShowUploadImage() {
        console.log("here");
        this.setState({ showUploadImage: !this.state.showUploadImage })
    }


    render() {
        const { id, firstname, lastname, email, username, bio, imgUrl } = this.props.user
        return (
            <div>
                <h1>Profile</h1>
                {/* <img id="banner" src="/coinbase.png" alt="coinbase" /> */}
                <section id="profile-info">
                    <div className="profile-left">
                        {/* <img src={ imgUrl } alt={ username }/> */}
                        <h2>{username}</h2>
                        <img src="http://www.gjermundbjaanes.com/img/posts/blockchain/lisk_logo.jpg" alt="profile-pic"/>
                        <p onClick={this.toggleShowUploadImage}>Upload new image</p>
                        { this.state.showUploadImage &&
                            <form onSubmit={this.submitUploadImage}>
                                <p>Upload a new image</p>
                                <input type="file" placeholder="upload an image" name="file" />
                            </form>
                        }
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

const mapStateToProps = function(state) {
    return {
        bio: state.user && state.user.bio,
        user: state.user
    }
}

export default connect(mapStateToProps)(Profile)
