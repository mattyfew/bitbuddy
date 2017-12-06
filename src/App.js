import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router'
import { updateBio } from './actions'
import { connect } from 'react-redux'
import { getUserInfo } from './actions'


class App extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.submitEditBio = this.submitEditBio.bind(this)
    }

    componentDidMount() {
        this.props.dispatch(getUserInfo())
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
        if (!this.props.user) {
            return (<div>Loading...</div>)
        }

        const children = React.cloneElement(this.props.children, {
            user: this.props.user,
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
                            <li><Link to="/user/2">user2</Link></li>
                            <li><Link to="/user/3">user3</Link></li>
                            <li><Link to="/user/4">user4</Link></li>
                        </ul>
                    </nav>
                </div>

                {children}
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

export default connect(mapStateToProps)(App)
