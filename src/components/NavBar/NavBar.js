import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import './NavBar.css'
import { Image } from 'cloudinary-react';

class NavBar extends Component {
    constructor() {
        super()
        this.state = {
            teams: [],
            teamsOpen: false,
            chatOpen: false
        }
    }

    toggleTeams() {
        this.setState({
            teamsOpen: !this.state.teamsOpen,
            chatOpen: false
        })
    }

    toggleChat() {
        this.setState({
            chatOpen: !this.state.chatOpen,
            teamsOpen: false
        }) 
    }

    closeDropdowns() {
        this.setState({
            teamsOpen: false,
            chatOpen: false
        })
    }


    async logout() {
        const res = await axios.get('/auth/logout')
        if (!res.data.loggedIn) {
            this.props.history.push('/')
        }
    }
    async componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
            const { id, email } = this.props.user
            const { pathname } = this.props.location
            if (pathname === '/' || pathname === '/register') {
                return null
            }
            const res = await axios.post('/api/team/teams', { id, email })
            this.setState({
                teams: res.data
            })
        }

    }
    getTeams() {
        const mapTeams = this.state.teams.map(team => {
            return (
                <h2 key={team.id}><div><Link onClick={() => {
                    this.closeDropdowns()
                }} to={`/myteam/${team.id}`}>{team.name}</Link></div></h2>
            )
        })
        return mapTeams;
    }
    getTeamChat() {
        const mapTeams = this.state.teams.map(team => {
            return (
                <h2 key={team.id}><div><Link onClick={() => {
                    this.closeDropdowns()
                }} to={`/chat/${team.id}`}>{team.name}</Link></div></h2>
            )
        })
        return mapTeams;
    }

    render() {
        const { pathname } = this.props.location
        return (
            pathname === '/' || pathname === '/register' ? <div></div> : (
                <div className='NavContainer' >
                    <div className='user'>
                        <Image cloudName='djqtnii8i' publicId={this.props.user.profile_picture_url || 'atlgolkdai0csdwtxu2h'} />
                        <p>{this.props.user.displayed_name || this.props.user.full_name || this.props.user.email}</p>
                    </div>
                    <div className='NavBar'>
                        <div className='linkContainer'>
                            <Link to='/profile' >
                                <Image cloudName='djqtnii8i' publicId='bqyyv0zbzsgmmd0jvgdn' alt='' />
                                <h2 onClick={() => {
                                    this.closeDropdowns()
                                }}>Profile</h2>
                            </Link>
                        </div>
                        <div className='myTeamListSection'>
                            <div className='linkContainer' onClick={() => this.toggleTeams()}>
                                <Image cloudName='djqtnii8i' publicId='ykay6cbo38uix8bqjofd' alt='' />
                                <h2>My Teams</h2>
                            </div>
                            {this.state.teamsOpen ? (
                                <div className='myTeamList'>
                                    {this.getTeams()}
                                </div>
                            ) : null}
                        </div>
                        <div onClick={() => this.closeDropdowns()} className='linkContainer'>
                            <Link to='/newteam' >
                                <Image cloudName='djqtnii8i' publicId='l336uuhjflxobh4py8oc' alt='' />
                                <h2>Create Team</h2>
                            </Link>
                        </div>
                        <div onClick={() => this.closeDropdowns()} className='linkContainer'>
                            <Link to='/myevents' >
                                <Image cloudName='djqtnii8i' publicId='ppufmzwedkmkpd0s4a7g' alt='' />
                                <h2>My Events</h2>
                            </Link>
                        </div>
                        <div className='myTeamListSection'>
                            <div className='linkContainer' onClick={() => this.toggleChat()}>
                                <Image cloudName='djqtnii8i' publicId='u1k4lh1bpl9es32lfm0p' alt='' />
                                <h2>Team Chat</h2>
                            </div>
                            {this.state.chatOpen ? (
                                <div className='myTeamChatList'>
                                    {this.getTeamChat()}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <button id='logout' onClick={() => this.logout()}>Logout</button>
                </div>
            ))
    }
}

const mapStateToProps = (reduxState) => {
    return (
        { ...reduxState }
    )
}

export default withRouter(connect(mapStateToProps)(NavBar));