import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default class Login extends Component {
    constructor(props) {
        super(props)

        this.state = { email: '', password: '' }

        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e){
        e.preventDefault()
        axios.post('/login-user', this.state)
            .then(() => location.replace('/') )

        this.setState({ email: '', password: '' })
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value })
    }

    render() {
        return (
            <div>
                <h2>Login Now</h2>
                <Link to="/">Click here to Register!</Link>

                <form id="register-form">
                    <div className="form-single-input-wrapper">
                        <label htmlFor="email-login">Email</label>
                        <input onChange={this.handleChange} type="text" name="email" id="email-register" placeholder="email" value={this.state.email}/>
                    </div>

                    <div className="form-single-input-wrapper">
                        <label htmlFor="password-register">Password</label>
                        <input onChange={this.handleChange} type="password" name="password" id="password-register" placeholder="password" value={this.state.password}/>
                    </div>

                    <p>Not registered? Click here to <Link to="/">register now!</Link></p>

                    <button onClick={this.handleClick}>Click</button>
                </form>
            </div>
        )
    }
}
