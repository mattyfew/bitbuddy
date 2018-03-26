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
        this.handleSubmitBio = this.handleSubmitBio.bind(this)
        this.handleSubmitImg = this.handleSubmitImg.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
    }

    toggleShowUploadImage() {
        this.setState({ showUploadImage: !this.state.showUploadImage })
    }

    handleSubmitBio() {
        this.props.submitEditBio(this.newBio.value)
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
                        <p onClick={ this.toggleShowUploadImage }>Upload new image</p>
                        
                        { this.state.showUploadImage &&
                            <form onSubmit={ this.handleSubmitImg }>
                                <input onChange={ this.handleFileChange } type="file" placeholder="upload an image" name="profilepic" />
                                <button type="submit">Submit</button>
                            </form>
                        }
                    </div>

                    <div className="profile-right">
                        <p>First Name: { firstname }</p>
                        <p>Last Name: { lastname }</p>
                        <p>Email: { email }</p>
                        <p>Username: { username }</p>
                        <textarea name="bio" id="bio" defaultValue={ bio } ref={ elem => this.newBio = elem } />
                        <button onClick={ this.handleSubmitBio }>Submit Changes</button>
                    </div>
                </section>
            </div>
        )
    }
}

export default connect(null)(Profile)
