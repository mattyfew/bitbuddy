import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router'

export default class Login extends Component {
    constructor(props) {
        super(props)

        this.state = { email: '', password: '' }

        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(){
        console.log("running handleClick", this.state);
        axios.post('/login-user', this.state)
            .then((response) => {
                console.log("this worked?", response);
            })

        this.setState({ firstname: '', lastname: '', email: '', username: '', password: '' })
    }

    handleChange(e) {
        this.setState( [e.target.name]: e.target.value,
            () => console.log("the new state is: ", this.state)
        )
    }

    render() {
        return (
            <div>
                <h2>Login Now</h2>
                <form id="register-form">
                    <div className="form-single-input-wrapper">
                        <label htmlFor="email-login">First Name</label>
                        <input onChange={this.handleChange} type="text" name="email" id="email-register" placeholder="email" value={this.state.email}/>
                    </div>

                    <div className="form-single-input-wrapper">
                        <label htmlFor="password-register">Last Name</label>
                        <input onChange={this.handleChange} type="text" name="password" id="password-register" placeholder="password" value={this.state.password}/>
                    </div>

                    <p>Not registered? Click here to <Link to="/">register now!</Link></p>

                    <button onClick={this.handleClick}>Click</button>
                </form>
            </div>
        )
    }
}
