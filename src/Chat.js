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
        <div style={styles.chatMessage} className="chat-message">
            <div className="msg">
                <div>
                    <span className="user-name">{message.firstname} {message.lastname}</span>
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
            let msg = e.target.value;
            e.target.value = '';
            this.props.sendMessage(msg);
            e.preventDefault();
        }
    }

    renderChatMessages() {
        return this.props.messages.map((msg, i) => <ChatMessage key={ i } message={ msg } />)
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
        backgroundColor: '#d1d8e0',
        width: '80%',
        margin: '16px auto',
        padding: '20px 30px'
    },
    chatMessage: {
        backgroundColor: '#2bcbba',
        padding: '16px',
        margin: '16px'
    }
}

function mapStateToProps(state) {
    return {
        messages: state.chatMessages
    }
}

export default connect(mapStateToProps)(Chat);
