import React, { Component } from 'react'
import { connect } from 'react-redux'
import { emit } from './socket'
import { Link } from 'react-router-dom'
import OnlineFriends from './OnlineFriends'

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
                <div id="online-friends">
                    <OnlineFriends />
                </div>

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

const ChatMessage = ({ chatMessage }) => {
    return (
        <div className="chat-message">
            <Link to={`/user/${chatMessage.author_id}`} >
                <img src="http://via.placeholder.com/100x100" className="chat-avatar" alt="user-image"/>
            </Link>
            <div className="msg">
                {/*<date>21:46 10/15/2018</date>*/}

                <Link to={`/user/${chatMessage.author_id}`} >
                    <span className="chat-message-username">{ chatMessage.text }</span>
                </Link>
                { chatMessage.text }
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        chatMessages: state.chatMessages,
        user: state.user
    }
}

export default connect(mapStateToProps)(Chat)
