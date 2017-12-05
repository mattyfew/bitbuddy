import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, browserHistory } from 'react-router';

import Welcome from './Welcome';
import Login from './Login';
import Registration from './Registration';
import App from './App';
import Profile from './Profile'
import OtherProfile from './OtherProfile'

let router

const notLoggedInRouter = (
    <Router history={hashHistory}>
        <Route path="/" component={Welcome}>
            <Route path="/login" component={Login} />
            <IndexRoute component={Registration} />
  	     </Route>
    </Router>
);

const loggedInRouter = (
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Profile} />
            <Route path="/user/:userId" component={OtherProfile} />
  	     </Route>
    </Router>
);

if (location.pathname === '/welcome/') {
    router = notLoggedInRouter
} else {
    router = loggedInRouter
}

ReactDOM.render(router, document.querySelector('main'));
