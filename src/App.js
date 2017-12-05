import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router'
import { updateBio } from './actions'
import { connect } from 'react-redux';


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null,
            firstname: '',
            lastname: '',
            email: '',
            username: '',
            bio: '',
            imgUrl: 'http://www.gjermundbjaanes.com/img/posts/blockchain/lisk_logo.jpg'
        }

        this.handleChange = this.handleChange.bind(this)
        this.submitEditBio = this.submitEditBio.bind(this)
    }

    componentDidMount() {
        axios.get('/get-user-info')
            .then(({ data: { id, firstname, lastname, email, username, bio } }) => {
                this.setState({ id, firstname, lastname, email, username, bio })
            })
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        }, () => console.log(this.state))

    }

    submitEditBio() {
        this.props.dispatch(updateBio(this.state.bio))
    }

    render() {
        if (!this.state.username) {
            return (<div>Loading...</div>)
        }

        const { id, firstname, lastname, email, username, bio, imgUrl } = this.state
        const children = React.cloneElement(this.props.children, {
            user: {
                id, firstname, lastname, email, username, bio, imgUrl
            },
            handleChange: this.handleChange,
            submitEditBio: this.submitEditBio
        })
        return (
            <div>
                <div id="nav-container">
                    <nav class="bar">
                        <Link to="/"><img id="fireball" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/500px-Bitcoin.svg.png" alt="logo" /></Link>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                        </ul>
                    </nav>
                </div>

                <h1>Welcome to Bitbuddy</h1>

                {children}
            </div>
        )
    }
}

const mapStateToProps = function(state) {
    console.log("here");
    return {
        bio: state.user && state.user.bio
    }
}

export default connect(mapStateToProps)(App)
