import React, { Component } from 'react';
import './TeamInvites.css';


class TeamInvites extends Component {
    constructor() {
        super()
        this.state = {
            invites: []
        }
    }

    render() {
        return (
            <div className='teamInvites'>
                <div className='navPlaceHolder'></div>
                <div className='container'>
                    <div className='myHeader'>
                        <h1>Team Invites</h1>
                    </div>
                    <div className='teamInvitesContainer'>

                    </div>
                </div>
            </div>
        )
    }
}

export default TeamInvites