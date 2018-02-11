import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

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

    handleClick(e){
        e.preventDefault()
        console.log("running handleClick", this.state);

        axios.post('/register-new-user', this.state)
            .then((response) => {
                console.log("success, redirecting to /", response);
                location.replace('/')
            })

        this.setState({ firstname: '', lastname: '', email: '', username: '', password: '' })
    }

    handleChange(e) {
        this.setState( { [e.target.name]: e.target.value },
            () => console.log("the new state is: ", this.state)
        )
    }

    render() {
        return (
            <div>
                <h2>Please register a new account to use Bitbuddy</h2>
                <form id="register-form">
                    <div className="form-single-input-wrapper">
                        <label htmlFor="firstname-register">First Name</label>
                        <input onChange={this.handleChange} type="text" name="firstname" id="firstname-register" placeholder="firstname" value={this.state.firstname}/>
                    </div>

                    <div className="form-single-input-wrapper">
                        <label htmlFor="lastname-register">Last Name</label>
                        <input onChange={this.handleChange} type="text" name="lastname" id="lastname-register" placeholder="lastname" value={this.state.lastname}/>
                    </div>

                    <div className="form-single-input-wrapper">
                        <label htmlFor="email-register">Email</label>
                        <input onChange={this.handleChange} type="text" name="email" id="email-register" placeholder="email" value={this.state.email}/>
                    </div>

                    <div className="form-single-input-wrapper">
                        <label htmlFor="password-register">Password</label>
                        <input onChange={this.handleChange} type="text" name="password" id="password-register" placeholder="password" value={this.state.password}/>
                    </div>

                    <div className="form-single-input-wrapper">
                        <label htmlFor="username-register">Username</label>
                        <input onChange={this.handleChange} type="text" name="username" id="username-register" placeholder="username" value={this.state.username}/>
                    </div>

                    <p>Already registered? Click here to <Link to="/login">log in</Link></p>

                    <button onClick={this.handleClick}>Click</button>
                </form>
            </div>
        )
    }
}
