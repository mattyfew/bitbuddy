import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, hashHistory, browserHistory } from 'react-router'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reduxPromise from 'redux-promise'
import { reducer } from './reducer'

import Welcome from './Welcome'
import Login from './Login'
import Registration from './Registration'
import App from './App';
import Profile from './Profile'
import OtherProfile from './OtherProfile'

const store = createStore(reducer, applyMiddleware(reduxPromise))

let router

const notLoggedInRouter = (
    <Router history={hashHistory}>
        <Route path="/" component={Welcome}>
            <Route path="/login" component={Login} />
            <IndexRoute component={Registration} />
  	     </Route>
    </Router>
)

const loggedInRouter = (
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Profile} />
                <Route path="/user/:userId" component={OtherProfile} />
        	     </Route>
        </Router>
    </Provider>
)

if (location.pathname === '/welcome/') {
    router = notLoggedInRouter
} else {
    router = loggedInRouter
}




ReactDOM.render(router, document.querySelector('main'))
