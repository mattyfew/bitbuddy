import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router'

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null,
            firstname: '',
            lastname: '',
            email: '',
            username: '',
            imgUrl: 'http://www.gjermundbjaanes.com/img/posts/blockchain/lisk_logo.jpg'
        }
    }

    componentDidMount() {
        axios.get('/get-user-info')
            .then(({ data: { firstname, lastname, email, username, id } }) => {
                this.setState({ firstname, lastname, email, username, id })
            })
    }

    render() {
        if (!this.state.username) {
            return (<div>Loading.......</div>)
        }

        const { id, firstname, lastname, email, username, imgUrl } = this.state
        const children = React.cloneElement(this.props.children, {
            user: {
                id, firstname, lastname, email, username, imgUrl
            }
        })
        return (
            <div>
                <div id="nav-container">
                    <nav class="bar">
                        <a href="/#/"><img id="fireball" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/500px-Bitcoin.svg.png" alt="logo" /></a>
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
