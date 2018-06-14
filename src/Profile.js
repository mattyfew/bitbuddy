import React, { Component } from 'react'
import { connect } from 'react-redux'
import { uploadImage } from './actions'
import { Spring } from 'react-spring'


class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showUploadImage: false,
            showBioForm: false,
            profilepic: null
        }

        this.toggleShowUploadImage = this.toggleShowUploadImage.bind(this)
        this.handleSubmitBio = this.handleSubmitBio.bind(this)
        this.handleSubmitImg = this.handleSubmitImg.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
        this.toggleBio = this.toggleBio.bind(this)
    }

    toggleShowUploadImage() {
        this.setState({ showUploadImage: !this.state.showUploadImage })
    }

    handleSubmitBio() {
        this.props.submitEditBio(this.newBio.value)
        this.toggleBio()
    }

    handleSubmitImg(e) {
        e.preventDefault()
        let formData = new FormData()
        formData.append('file', this.state.profilepic)
        this.props.dispatch(uploadImage(formData))
    }

    handleFileChange(e) {
        this.setState({ [e.target.name]: e.target.files[0] })
    }

    toggleBio() {
        this.setState({ showBioForm: !this.state.showBioForm })
    }

    render() {
        const { id, firstname, lastname, email, username, bio, imgUrl } = this.props.user
        return (
            <div className="page">
                <section id="profile-info">
                    <div className="profile-left">
                        <h2>{username}</h2>
                        <img onClick={ this.toggleShowUploadImage } src="http://www.gjermundbjaanes.com/img/posts/blockchain/lisk_logo.jpg" alt="profile-pic"/>

                        { this.state.showUploadImage &&
                            <form onSubmit={ this.handleSubmitImg }>
                                <input onChange={ this.handleFileChange } type="file" placeholder="upload an image" name="profilepic" />
                                <button type="submit">Submit</button>
                            </form>
                        }
                    </div>

                    <div className="profile-right">
                        <p>Name: { firstname } { lastname }</p>
                        <p>Email: { email }</p>
                        <p>Username: { username }</p>

                        { bio
                            ? <p className="edit-bio" onClick={ this.toggleBio }>Bio: { bio } <i className="fas fa-pencil-alt"></i></p>
                            : <p className="edit-bio" onClick={ this.toggleBio }>Click to add a bio</p>
                        }

                        { this.state.showBioForm &&
                            <React.Fragment>
                                <textarea name="bio" id="bio" defaultValue={ bio } ref={ elem => this.newBio = elem } />
                                <button onClick={ this.handleSubmitBio }>Submit Changes</button>
                            </React.Fragment>
                        }
                    </div>
                </section>
            </div>
        )
    }
}

export default connect(null)(Profile)
