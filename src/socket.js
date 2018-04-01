import * as io from 'socket.io-client';
import { chatMessage, chatMessages, onlineUsers, userJoined, userLeft } from './actions';

let socket
export function initSocket(store) {
    if (!socket) {
        socket = io.connect();
        socket.on('onlineUsers', users => store.dispatch(onlineUsers(users)))
        socket.on('userJoined', user => store.dispatch(userJoined(user)))
        socket.on('userLeft', userId => store.dispatch(userLeft(userId)))
        socket.on('chatMessages', messages => store.dispatch(chatMessages(messages)))
        socket.on('chatMessage', messageData =>  {
            console.log("mero");
            store.dispatch(chatMessage(messageData))
        })
    }
    return socket;
}

export function emit(event, data) {
    socket.emit(event, data)
}
