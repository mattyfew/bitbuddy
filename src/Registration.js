import React, { Component } from 'react'
import axios from 'axios'

export default class Registration extends Component {
    constructor(props) {
        super(props)

        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            username: '',
            password: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(){
        console.log("running handleClick", this.state);
        axios.post('/register-new-user', this.state)
            .then((response) => {
                console.log("this worked?", response);
            })

        this.setState({ firstname: '', lastname: '', email: '', username: '', password: '' })
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        }, () => {
            console.log("the new state is: ", this.state)
        })
    }

    render() {
        return (
            <div>
                <h1>Registration</h1>
                <input onChange={this.handleChange} type="text" name="firstname" placeholder="firstname" value={this.state.firstname}/>
                <input onChange={this.handleChange} type="text" name="lastname" placeholder="lastname" value={this.state.lastname}/>
                <input onChange={this.handleChange} type="text" name="email" placeholder="email" value={this.state.email}/>
                <input onChange={this.handleChange} type="text" name="password" placeholder="password" value={this.state.password}/>
                <input onChange={this.handleChange} type="text" name="username" placeholder="username" value={this.state.username}/>
                <button onClick={this.handleClick}>Click</button>
            </div>
        )
    }
}
