import React, { Component } from 'react'
import axios from 'axios'
import { BrowserRouter, Route, Link, Redirect, Switch } from 'react-router-dom';
import { updateBio } from './actions'
import { connect } from 'react-redux'
import { getUserInfo } from './actions'

import Profile from './Profile'
import OtherProfile from './OtherProfile'
import Chat from './Chat'

export default class App extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.submitEditBio = this.submitEditBio.bind(this)
    }

    componentDidMount() {
        // this.props.dispatch(getUserInfo())
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        }, () => console.log(this.state))

    }

    submitEditBio() {
        // this.props.dispatch(updateBio(this.state.bio))
    }

    render() {
        // if (!this.props.user) {
        //     return (<div>Loading...</div>)
        // }

        return (
            <div>
                <BrowserRouter>
                     <div id="app">
                         <div id="nav-container">
                             <nav className="bar">
                                 <Link to="/"><img id="fireball" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/500px-Bitcoin.svg.png" alt="logo" /></Link>
                                 <ul>
                                     <li><Link to="/">Home</Link></li>
                                     <li><Link to="/user/2">user2</Link></li>
                                     <li><Link to="/user/3">user3</Link></li>
                                     <li><Link to="/user/4">user4</Link></li>
                                     <li><Link to="/chat">somehing</Link></li>
                                 </ul>
                             </nav>
                         </div>
                         <Switch>
                             <Route exact path="/" component={Profile} />
                             <Route exact path="/user/:userId" component={OtherProfile} />
                             <Route exact path="/chat" component={Chat} />
                             <Redirect path="*" to="/" />
                         </Switch>
                     </div>
                 </BrowserRouter>
            </div>
        )
    }
}

// const mapStateToProps = function(state) {
//     return {
//         bio: state.user && state.user.bio,
//         user: state.user
//     }
// }
//
// export default connect(mapStateToProps)(App)
