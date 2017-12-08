import React, { Component } from 'react'
import { connect } from 'react-redux'
import { uploadImage } from './actions'

class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showUploadImage: false,
            profilepic: null
        }

        this.toggleShowUploadImage = this.toggleShowUploadImage.bind(this)
        this.submitUploadImage = this.submitUploadImage.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    toggleShowUploadImage() {
        this.setState({ showUploadImage: !this.state.showUploadImage })
    }

    submitUploadImage(e) {
        console.log("about to submit profilepic");
        e.preventDefault()
        let formData = new FormData();
        formData.append('profilepic', this.state.profilepic);

        this.props.dispatch(uploadImage(formData))
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0]

        }, () => {
            console.log('new state', this.state);
        })
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
                                <input onChange={this.handleChange} type="file" placeholder="upload an image" name="profilepic" />
                                <button type="submit">Submit</button>
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
