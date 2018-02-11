import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, hashHistory, browserHistory } from 'react-router'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reduxPromise from 'redux-promise'
import { reducer } from './reducer'
import { composeWithDevTools } from 'redux-devtools-extension';

import Welcome from './Welcome'
import Login from './Login'
import Registration from './Registration'
import App from './App';
import Profile from './Profile'
import OtherProfile from './OtherProfile'
import Chat from './Chat'

import { initSocket } from './socket';



let elem
if (location.pathname === '/welcome/') {
    elem = <Welcome />
} else {
    // const store = createStore(reducer, applyMiddleware(reduxPromise))

    const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));
    initSocket(store)
    elem = <Provider store={store}><App /></Provider>
}

ReactDOM.render(elem, document.querySelector('main'))
