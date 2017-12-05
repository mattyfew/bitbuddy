import React, { Component } from 'react'
import axios from 'axios'

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null,
            firstname: '',
            lastname: '',
            email: '',
            username: ''
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

        const { firstname, lastname, email, username, id } = this.state
        const children = React.cloneElement(this.props.children, {
            firstname, lastname, email, username, id 
        })
        return (
            <div>
                <h1>App</h1>

                {children}
            </div>
        )
    }
}
