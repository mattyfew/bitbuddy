import * as io from 'socket.io-client';
import { chatMessage, chatMessages, onlineUsers, userJoined, userLeft } from './actions';

let socket
export function initSocket(store) {
    if (!socket) {
        socket = io.connect();
        socket.on('onlineUsers', users => store.dispatch(onlineUsers(users)))
        socket.on('userJoined', user => store.dispatch(userJoined(user)))
        socket.on('userLeft', userId => store.dispatch(userLeft(userId)))
        socket.on('chats', messages => store.dispatch(chatMessages(messages)))
        socket.on('chat', messageData => store.dispatch(chatMessage(messageData)))
    }
    return socket;
}

export function emit() {
    return socket && socket.emit.apply(socket, arguments);
}
