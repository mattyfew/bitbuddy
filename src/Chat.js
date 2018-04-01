import React, { Component } from 'react'
import { connect } from 'react-redux'
import { emit } from './socket'

class Chat extends Component {
    constructor(props) {
        super(props)

        this.scrollToBottom = this.scrollToBottom.bind(this)
        this.renderChatMessages = this.renderChatMessages.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
    }

    componentDidUpdate() {
        this.scrollToBottom()
    }

    scrollToBottom() {
        const { elem } = this
        if (elem) {
            elem.scrollTop = elem.scrollHeight - elem.clientHeight
        }
    }

    onKeyDown(e) {
        if (e.keyCode == 13) {
            const { id, username, profilepic } = this.props.user

            let text = e.target.value
            e.target.value = ''

            // TODO: Fix this, this does not give the accurate time
            function createTimestamp(unixtime) {
                const newDate = new Date();
                newDate.setTime(unixtime*1000);
                return newDate.toUTCString();
            }

            emit('chatMessage', {
                userId: id,
                username,
                text,
                profilepic
                // createdAt: createTimestamp(Date.now())
            })
            e.preventDefault()
        }
    }

    renderChatMessages() {
        if (!this.props.chatMessages) {
            return (<div>Loading...</div>)
        }

        return this.props.chatMessages.map((chatMessage, i) =>
            <ChatMessage key={ i } chatMessage={ chatMessage } />
        )
    }

    render() {
        return (
            <div>
                <h1>Chit Chat</h1>

                <div id="chat-container">
                    { this.renderChatMessages() }
                    <ChatForm user={this.props.user} onKeyDown={ this.onKeyDown }/>
                </div>
            </div>
        )
    }
}

const ChatForm = props => {
    return (
        <form>
            <textarea onKeyDown={ props.onKeyDown } id="chat-textarea" placeholder="enter a chat message" />
        </form>
    )
}

const ChatMessage = props => {
    return (
        <div className="chat-message">
            <div className="msg">
                {props.chatMessage.text}
            </div>
        </div>
    )
}
//
// class ChatMessages extends Component {
//     constructor(props){
//         super(props)
//     }
//
//     componentDidUpdate() {
//         this.scrollToBottom();
//     }
//
//     scrollToBottom() {
//         const { elem } = this;
//         if (elem) {
//             elem.scrollTop = elem.scrollHeight - elem.clientHeight;
//         }
//     }
//
//     onKeyDown(e) {
//         if (e.keyCode == 13) {
//             let msg = e.target.value;
//             e.target.value = '';
//             this.props.sendMessage(msg);
//             e.preventDefault();
//         }
//     }
//
//     renderChatMessages() {
//         return this.props.messages.map((msg, i) => <ChatMessage key={ i } message={ msg } />)
//     }
//
//     render() {
//         if (!this.props.messages){
//             return <div>Loading chat...</div>
//         }
//         return (
//             <div>
//                 <div style={styles.container} id="group-chat-container" ref={elem => this.elem = elem}>
//                     { this.renderChatMessages() }
//                 </div>
//
//                 <textarea onKeyDown={e => this.onKeyDown(e) }></textarea>
//             </div>
//         )
//     }
// }
//
// class Chat extends React.Component {
//     sendMessage(message) {
//         emit('chat', { message });
//     }
//     render() {
//         return <ChatMessages messages={this.props.messages} sendMessage={(msg) => this.sendMessage(msg)}/>
//     }
// }

function mapStateToProps(state) {
    return {
        chatMessages: state.chatMessages,
        user: state.user
    }
}

export default connect(mapStateToProps)(Chat)
