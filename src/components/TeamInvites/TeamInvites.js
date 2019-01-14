import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { updateTeam, updateUser } from '../../ducks/reducer';
import './TeamInvites.css';


class TeamInvites extends Component {
    // constructor() {
    //     super()
    //     this.state = {
    //         invites: []
    //     }
    // }

    async componentDidMount() {
        let userRes = await axios.get('/api/user')
        this.props.updateUser(userRes.data)
        let inviteRes = await axios.get('/api/invite')
        this.props.updateUser(inviteRes.data)
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevProps.user.invites.length !== this.props.user.invites.length) {

    //     }
    // }

    async answerInvite(id, team_id, answer) {
        const res = await axios.post('/api/invite/answer', {id, team_id, answer})
        this.props.updateUser(res.data)
    }

    render() {
        let invitesMap = []
        let invites = this.props.user.invites || []
        if (invites[0]) {
            invitesMap = invites.map(invite => {
                const {id, team_id, team_name} = invite
                return (
                    <div key={id} className='invite'>
                        <h2>You have been invited to join team</h2>
                        <h1>{team_name}</h1>
                        <h2>Do you want to join this team?</h2>
                        <div className='inviteButtons'>
                            <button onClick={invite => this.answerInvite(id, team_id, true)}>Yes</button>
                            <button onClick={invite => this.answerInvite(id, team_id, false)}>No</button>
                        </div>
                    </div>
                )
            })
        }
        return (
            <div className='teamInvites'>
                <div className='navPlaceHolder'></div>
                <div className='container'>
                    <div className='myHeader'>
                        <h1>Team Invites</h1>
                    </div>
                    <div className='teamInvitesContainer'>
                        <div className='myInvites'>
                            {invites[0] ? (
                                invitesMap
                            ) : (
                                    <h1>You are all caught up on invitations</h1>
                                )}
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

export default connect(mapStateToProps, { updateTeam, updateUser })(TeamInvites);