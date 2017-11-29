import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import Welcome from './Welcome';
import Login from './Login';
import Registration from './Registration';


const router = (
    <Router history={hashHistory}>
        <Route path="/" component={Welcome}>
            <Route path="/login" component={Login} />
            <IndexRoute component={Registration} />
  	     </Route>
    </Router>
);

ReactDOM.render(router, document.querySelector('main'));
