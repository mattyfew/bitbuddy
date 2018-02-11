import React, { Component } from 'react'
import { connect } from 'react-redux'
import { emit } from './socket'

class Chat extends React.Component {
    sendMessage(message) {
        emit('chat', { message });
    }
    render() {
        return <ChatMessages messages={this.props.messages} sendMessage={(msg) => this.sendMessage(msg)}/>
    }
}

const ChatMessage = ({ message }) => {
    return (
        <div className="message">
            <div className="pic"><img src={message.image} /></div>
            <div className="msg">
                <div>
                    <span className="user-name">{message.first} {message.last}</span>
                    <span className="date">{message.timestamp}</span>
                </div>
                {message.message}
            </div>
        </div>
    )
}

class ChatMessages extends Component {
    constructor(props){
        super(props)
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        const { elem } = this;
        if (elem) {
            elem.scrollTop = elem.scrollHeight - elem.clientHeight;
        }
    }

    onKeyDown(e) {
        if (e.keyCode == 13) {
            console.log(e.target.value);
            let msg = e.target.value;
            e.target.value = '';
            this.props.sendMessage(msg);
            e.preventDefault();
        }
    }

    renderChatMessages() {
        return this.props.messages.map(msg => <ChatMessage key={msg.id} message={msg} />)

    }

    render() {
        if (!this.props.messages){
            return <div>Loading chat...</div>
        }
        return (
            <div>
                <div style={styles.container} id="group-chat-container" ref={elem => this.elem = elem}>
                    { this.renderChatMessages() }
                </div>

                <textarea onKeyDown={e => this.onKeyDown(e) }></textarea>
            </div>
        )
    }
}

const styles = {
    container: {
        backgroundColor: 'red',
        height: 300,
        weight: 300
    }
}

function mapStateToProps(state) {
    console.log("mapStateToProps", state)
    return {
        messages: state.chatMessages
    }
}

export default connect(mapStateToProps)(Chat);
