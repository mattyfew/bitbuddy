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
        var fileName = '';
        if( this.files && this.files.length > 1 ){
            fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length )
        } else {
            fileName = e.target.value.split( '\\' ).pop()
        }

        if( fileName ) {
            this.label.querySelector( 'span' ).innerHTML = fileName
        } else {
            this.label.innerHTML = labelVal
        }

        this.setState({ [e.target.name]: e.target.files[0] }, () => {
            e.target.value = ''
        })
    }

    toggleBio() {
        this.setState({ showBioForm: !this.state.showBioForm })
    }

    render() {
        const { id, firstname, lastname, email, username, bio, imgUrl } = this.props.user
        return (
            <div className="page">
                <section id="profile-info">
                    <img onClick={ this.toggleShowUploadImage } src="http://www.gjermundbjaanes.com/img/posts/blockchain/lisk_logo.jpg" alt="profile-pic"/>
                    <h2>{username}</h2>
                    <p>{ firstname } { lastname }</p>
                    <p>Email: { email }</p>

                    <div className="profile-left">

                        { this.state.showUploadImage &&
                            <div id="upload-modal">
                                <div id="overlay" onClick={ this.toggleShowUploadImage }></div>
                                <div id="upload-form-container">
                                    <h3>Choose a profile picture</h3>
                                    <form onSubmit={ this.handleSubmitImg }>
                                        <input id="image-upload-input" onChange={ this.handleFileChange } type="file" placeholder="upload an image" name="profilepic" data-multiple-caption="{count} files selected" multiple />
                                        <label htmlFor="image-upload-input" ref={ elem => this.label = elem }>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
                                            <span>Choose File</span>
                                        </label>
                                        <button type="submit">Submit</button>
                                    </form>
                                </div>
                            </div>
                        }
                    </div>

                    <div className="profile-right">


                        { bio
                            ? <p className="edit-bio" onClick={ this.toggleBio }>Bio: { bio } <i className="fas fa-pencil-alt"></i></p>
                            : <p className="edit-bio" onClick={ this.toggleBio }>Click to add a bio</p>
                        }

                        { this.state.showBioForm &&
                            <React.Fragment>
                                <p onClick={ this.toggleBio }>Cancel</p>
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
