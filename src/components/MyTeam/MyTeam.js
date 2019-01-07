import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { updateTeam, updateUser } from '../../ducks/reducer';
import { Link } from 'react-router-dom';
import './MyTeam.css';

class MyTeam extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            name: '',
            description: '',
            manager: '',
            delete: false
        }
    }

    async componentDidMount() {
        let teamId = this.props.match.params.teamid
        let userRes = await axios.get('/api/user')
        this.props.updateUser(userRes.data)
        let teamRes = await axios.get(`/api/team/${teamId}`)
        this.props.updateTeam(teamRes.data)
    }

    async componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
            let teamId = this.props.match.params.teamid
            let teamRes = await axios.get(`/api/team/${teamId}`)
            this.props.updateTeam(teamRes.data)
            let userRes = await axios.get('/api/user')
            this.props.updateUser(userRes.data)
        }
    }

    async editTeamDescription() {
        const { description } = this.state
        const teamId = this.props.team.id
        const res = await axios.post('/api/team/description', { teamId, description })
        this.props.updateTeam(res.data)
        this.setState({
            description: ''
        })
    }

    async editTeamName() {
        const { name } = this.state
        if (!name) {
            return alert('Needs a name')
        }
        const teamId = this.props.team.id
        const res = await axios.post('/api/team/name', { teamId, name })
        this.props.updateTeam(res.data)
        this.setState({
            name: ''
        })
    }

    async editTeamManager() {
        const { manager } = this.state
        if (!manager) {
            return alert('Needs a manager')
        }
        const teamId = this.props.team.id
        const res = await axios.post('/api/team/manager', { teamId, manager })
        this.props.updateTeam(res.data)
        this.setState({
            manager: ''
        })
    }

    async addUserToTeam() {
        const { email } = this.state
        if (!email) {
            return alert('Needs a email')
        }
        const teamId = this.props.team.id
        const res = await axios.post('/api/team/member', { email, teamId })
        if (res.data.members) {
            this.props.updateTeam(res.data)
        }
        this.setState({
            email: ''
        })
    }

    async removeFromTeam(id) {
        const teamId = this.props.team.id
        const res = await axios.post('/api/team/remove', { teamId, id })
        this.props.updateTeam(res.data)
    }

    async removeFromTeamLink(id) {
        const teamId = this.props.team.id
        const res = await axios.post('/api/team/leave', { teamId, id })
        this.props.updateTeam(res.data)
        this.props.history.push('/profile')
    }

    toggleDelete() {
        this.setState({
            delete: !this.state.delete
        })
    }

    async deleteTeam() {
        const teamId = this.props.team.id
        const res = await axios.post('/api/team/delete', { teamId })
        this.props.updateTeam(res.data)
        this.props.history.push('/profile')
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        let mapMembers = [];
        if (this.props.user.email) {
            if (this.props.team.members) {
                if (this.props.team.team_manager === this.props.user.id) {
                    mapMembers = this.props.team.members.map(member => {
                        const { full_name, email, phone, preferred_contact_method, displayed_name, id } = member
                        if (this.props.user.id === id) {
                            return (
                                <div key={id}>
                                    <h2>{displayed_name || full_name || email}
                                        <div className="popup">Details
                                    <span className="popuptext" id="myPopup"><p>{`Full Name: ${full_name || '?'}`}</p> <p>{`Email: ${email || '?'}`}</p> <p>{`Phone: ${phone || '?'}`}</p> <p>{`Preferred Contact Method: ${preferred_contact_method || '?'}`}</p></span>
                                        </div>
                                    </h2>
                                </div>
                            )
                        }
                        return (
                            <div key={id}>
                                <h4 className='removeButton' >Remove from team <button onClick={() => this.removeFromTeam(id)}>X</button></h4>
                                <h2>{displayed_name || full_name || email}
                                    <div className="popup">Details
                                <span className="popuptext" id="myPopup"><p>{`Full Name: ${full_name || '?'}`}</p> <p>{`Email: ${email || '?'}`}</p> <p>{`Phone: ${phone || '?'}`}</p> <p>{`Preferred Contact Method: ${preferred_contact_method || '?'}`}</p></span>
                                    </div>
                                </h2>
                            </div>
                        )
                    })
                } else {
                    mapMembers = this.props.team.members.map(member => {
                        const { full_name, email, phone, preferred_contact_method, displayed_name, id } = member
                        return (
                            <div key={id}>
                                <h2>{displayed_name || full_name || email}
                                    <div className="popup">Details
                                    <span className="popuptext" id="myPopup"><p>{`Full Name: ${full_name || '?'}`}</p> <p>{`Email: ${email || '?'}`}</p> <p>{`Phone: ${phone || '?'}`}</p> <p>{`Preferred Contact Method: ${preferred_contact_method || '?'}`}</p></span>
                                    </div>
                                </h2>
                            </div>
                        )
                    })
                }
                return (
                    <div className='MyTeam'>
                        <div className='navPlaceHolder'></div>
                        <div className='container'>
                            <div className='myHeader'>
                                <h1>{this.props.team.name}</h1>
                            </div>
                            <div className='myTeamContainer'>
                                <div className='myTeamInfoSections'>
                                    <div className='myTeamInfo myTeamDescription'>
                                        <h3>Team {this.props.team.name} </h3>
                                        <h2>{this.props.team.description}</h2>
                                    </div>
                                    <div id='scrollingDiv' className='myTeamInfo myTeamMembers'>
                                        <h3>Members: </h3>{mapMembers}
                                    </div>
                                </div>
                                {this.props.team.team_manager === this.props.user.id ? (
                                    <div className='editMyTeam'>
                                        <div className='newEventLink'>
                                            <Link to={`/newevent/${this.props.team.id}`} ><button onClick={() => this.createEvent}>Create Team Event</button></Link>
                                        </div>
                                        <h2 className='EditTitle'>Edit Team</h2>
                                        <div className='editTeam'>
                                            <div className='editTeamName'>
                                                <h2>Edit Team Name</h2>
                                                <input name='name' onChange={(event) => this.handleInputChange(event)} placeholder='Name' />
                                                <button onClick={() => this.editTeamName()} >Save</button>
                                            </div>
                                            <div className='editTeamDescription'>
                                                <h2>Edit Team Description</h2>
                                                <textarea name='description' onChange={(event) => this.handleInputChange(event)} placeholder='Click and drag the bottom right corner to resize' />
                                                <button onClick={() => this.editTeamDescription()} >Save</button>
                                            </div>
                                            <div className='newTeamMember'>
                                                <h2>Add Team Member</h2>
                                                <input type='email' name='email' value={this.state.email} onChange={event => this.handleInputChange(event)} placeholder='E-mail' />
                                                <button onClick={() => this.addUserToTeam()} >Add</button>
                                            </div>
                                        </div>
                                        <h2 className='EditTitle'>Change Manager</h2>
                                        <div className='editManager'>
                                            <h2>Warning!!! If you change this, you will no longer be able to edit the team!</h2>
                                            <h2>New Manager's Email</h2>
                                            <div className='changeManagerInput'>
                                                <input placeholder='Email' name='manager' value={this.state.manager} onChange={event => this.handleInputChange(event)} />
                                                <button onClick={() => this.editTeamManager()}>Change</button>
                                            </div>
                                        </div>
                                        <h2 className='EditTitle'>Delete Team</h2>
                                        <div className='deleteTeam'>
                                            {this.state.delete ? (
                                                <div className='deleteButtons'>
                                                    <h2>Warning!!! There is no undo for this!!!</h2>
                                                    <button onClick={() => this.deleteTeam()}>Yes! Please delete this team</button>
                                                    <button onClick={() => this.toggleDelete()}>Nevermind</button>
                                                </div>
                                            ) :
                                                <div className='deleteButtons'>
                                                    <button onClick={() => this.toggleDelete()}>Delete this team?</button>
                                                </div>}

                                        </div>
                                    </div>
                                ) : null}
                                {this.props.team.team_manager !== this.props.user.id ? (
                                    <div className='leaveTeam'>
                                        <h2>Leave this team</h2>
                                        <button onClick={() => this.removeFromTeamLink(this.props.user.id)}>Leave</button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className='loadingContainer'>
                        <div className='navPlaceHolder'></div>
                        <div className='loading' >
                            Loading...
                        </div>
                    </div>
                )
            }

        } else {
            return (
                <div className='loadingContainer'>
                    <div className='navPlaceHolder'></div>
                    <div className='login'>
                        Please login first
                    <Link to='/'>Login</Link>
                        <div></div>
                    </div>
                </div>
            )
        }
    }
}

const mapStateToProps = (reduxState) => {
    return (
        { ...reduxState }
    )
}

export default connect(mapStateToProps, { updateTeam, updateUser })(MyTeam);