import React from 'react';
// import { connect } from 'react-redux';
import * as io from 'socket.io-client';
// import { onlineUser, onlineUsers, offlineUser, chatMessages, chatMessage } from './actions';
import { chatMessage, chatMessages } from './actions';


let socket
export function initSocket(store) {
    if (!socket) {
        socket = io.connect();
        // socket.on('onlineUsers', users => store.dispatch(onlineUsers(users)))
        // socket.on('onlineUser', user => store.dispatch(onlineUser(user)))
        // socket.on('offlineUser', id => store.dispatch(offlineUser(id)))
        socket.on('chats', messages => store.dispatch(chatMessages(messages)))
        socket.on('chat', messageData => store.dispatch(chatMessage(messageData)))
    }
    return socket;
}

export function emit() {
    return socket && socket.emit.apply(socket, arguments);
}
