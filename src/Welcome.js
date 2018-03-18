import React, { Component } from 'react'
import { HashRouter, Route, Link, Redirect, Switch } from 'react-router-dom'

import Login from './Login'
import Registration from './Registration'

export default class Welcome extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="main-wrapper" id="welcome-container" >
      			<h1>Welcome to BitBuddy!</h1>
                <HashRouter>
                    <div className="forms">
                        <Switch>
                            <Route exact path="/" component={Registration} />
                            <Route path="/login" component={Login} />
                            <Redirect path="*" to="/" />
                        </Switch>
                    </div>
                </HashRouter>
      		</div>
        )
    }
}
