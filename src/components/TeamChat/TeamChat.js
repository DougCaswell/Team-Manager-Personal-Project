import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { updateTeam, updateUser } from '../../ducks/reducer';
import io from 'socket.io-client';
import './TeamChat.css';
import { Link } from 'react-router-dom';

class TeamChat extends Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            newMessage: '',
            firstTime: true,
            atBottom: true
        }
    }

    async componentDidMount() {
        let team_id = +this.props.match.params.teamid
        let userRes = await axios.get('/api/user')
        this.props.updateUser(userRes.data)
        let teamRes = await axios.get(`/api/team/${team_id}`)
        this.props.updateTeam(teamRes.data)
        const room = 'room ' + team_id
        this.socket = io()

        this.socket.emit('load messages', { team_id, user_id: this.props.user.id, room })

        this.socket.on('get messages', array => this.updateMessages(array))

    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.teamid !== this.props.match.params.teamid) {
            let teamId = this.props.match.params.teamid
            let teamRes = await axios.get(`/api/team/${teamId}`)
            this.props.updateTeam(teamRes.data)
            let userRes = await axios.get('/api/user')
            this.props.updateUser(userRes.data)

            this.socket.emit('load messages', { team_id: this.props.team.id, user_id: this.props.user.id, room: 'room ' + this.props.team.id })
        }
        if (prevState.messages.length !== this.state.messages.length) {
            let messagesDiv = document.getElementById('messages');

            if (this.state.firstTime) {
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
                this.setState({
                    firstTime: false
                });
            } else if (this.state.atBottom) {
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }
        } else if (prevState.firstTime !== this.state.firstTime) {
            let messagesDiv = document.getElementById('messages');
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    }



    updateMessages(messages) {
        let messagesDiv = document.getElementById('messages');
        let atBottom = messagesDiv.scrollTop + messagesDiv.clientHeight === messagesDiv.scrollHeight
        if (atBottom) {
            this.setState({
                messages: messages,
                atBottom: true
            })
        } else {
            this.setState({
                messages: messages,
                atBottom: false
            })
        }
        if (this.state.firstTime) {
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
            this.setState({
                firstTime: false
            });
        }
    }

    handleERROR(obj) {
        return alert(obj.message)
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    sendMessage() {
        const team_id = this.props.team.id
        const user_id = this.props.user.id

        this.socket.emit('message sent', { team_id, user_id, message: this.state.newMessage })

        this.setState({
            newMessage: ''
        })
    }

    render() {
        let mappedMessages = this.state.messages.map(message => {
            if (message.email === this.props.user.email) {
                return (
                    <div key={message.id} className='myMessage'>
                        <p>{message.message}</p>
                    </div>
                )
            } else {
                return (
                    <div key={message.id} className='message'>
                        <h2>{message.displayed_name || message.full_name || message.email}</h2>
                        <p>{message.message}</p>
                    </div>
                )
            }
        })
        if (!this.props.user.email) {
            return (
                <div className='Dashboard'>
                    <div className='navPlaceHolder'></div>
                    <div className='container'>
                        <div className='myHeader'>
                            <h1>Team Chat</h1>
                        </div>
                        <div className='login'>
                            Please login first
                    <Link to='/'>Login</Link>
                        </div>
                    </div>
                </div>
            )
        }
        if (this.state.firstTime) {
            return (
                <div className='loadingContainer'>
                    <div className='navPlaceHolder'></div>
                    <div className='loading' >
                        Loading...
                        </div>
                    <div id='messages'></div>
                </div>
            )
        }
        return (
            <div className='teamChat'>
                <div className='navPlaceHolder'></div>
                <div className='container'>
                    <div className='myHeader'>
                        <h1>{this.props.team.name} chat room</h1>
                    </div>
                    <div className='teamChatContainer'>
                        <div className='messages' id='messages'>
                            {mappedMessages}
                        </div>
                        <div id='newMessage'>
                            <input placeholder='New Message' maxLength='500' name='newMessage' value={this.state.newMessage} onChange={event => this.handleInputChange(event)} />
                            <button onClick={() => this.sendMessage()}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (reduxState) => {
    return (
        { ...reduxState }
    )
}

export default connect(mapStateToProps, { updateTeam, updateUser })(TeamChat);