import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reduxPromise from 'redux-promise'
import { reducer } from './reducer'
import { composeWithDevTools } from 'redux-devtools-extension';

import Welcome from './Welcome'
import App from './App'
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
