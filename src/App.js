import React, { Component } from 'react'
import axios from 'axios'
import { BrowserRouter, Route, Link, Redirect, Switch } from 'react-router-dom'
import { updateBio, getUserInfo } from './actions'
import { connect } from 'react-redux'

import Profile from './Profile'
import OtherProfile from './OtherProfile'
import Chat from './Chat'
import Friends from './Friends'
import OnlineFriends from './OnlineFriends'

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

    submitEditBio(bio) {
        this.props.dispatch(updateBio(bio))
    }

    render() {
        const { user, otherUser } = this.props

        if (!user) {
            return (<div>Loading...</div>)
        }

        return (
            <div>
                <BrowserRouter>
                     <div id="app">
                         <div id="nav-container">
                             <nav className="bar">
                                 <Link to="/"><img id="fireball" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/500px-Bitcoin.svg.png" alt="logo" /></Link>
                                 <ul>
                                     <li><Link to="/">Home</Link></li>
                                     <li><Link to="/chat">Chat</Link></li>
                                     <li><Link to="/friends">Friends</Link></li>
                                     <li><a href="/logout">Logout</a></li>
                                 </ul>
                             </nav>
                         </div>
                         <Switch>
                             {/*<Route exact path="/" component={Profile} />*/}
                             <Route exact path="/" render={() =>
                                <Profile
                                    user={ user }
                                    submitEditBio={ this.submitEditBio }
                                    handleChange={ this.handleChange }
                                />
                             } />
                             <Route exact path="/user/:userId" component={ OtherProfile } />
                             <Route exact path="/chat" component={ Chat } />
                             <Route exact path="/friends" component={ Friends } />
                             <Route exact path="/online-friends" component={ OnlineFriends } />
                             <Redirect path="*" to="/" />
                         </Switch>
                     </div>
                 </BrowserRouter>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return {
        bio: state.user && state.user.bio,
        user: state.user
    }
}

export default connect(mapStateToProps)(App)
