import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateUser, updateTeam } from '../../ducks/reducer';
import axios from 'axios';
import './NewTeam.css';

class NewTeam extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            description: '',
        }
    }

    async componentDidMount() {
        const res = await axios.get('/api/user')
        const user = res.data
        this.props.updateUser(user)
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    async createTeam() {
        const { id } = this.props.user
        const res = await axios.post('/api/team/new', { name: this.state.name, description: this.state.description, id })
        this.setState({
            name: '',
            description: ''
        })
        this.props.updateTeam(res.data)
        const teamId = res.data.id
        this.props.history.push(`/myteam/${teamId}`)
    }

    render() {
        if (this.props.user.email) {
            return (
                <div className='NewTeam'>
                    <div className='navPlaceHolder'></div>
                    <div className='container'>
                        <div className='myHeader'>
                            <h1>New Team</h1>
                        </div>
                        <div className='myNewTeamContainer'>
                            <div>
                                <h3>Team Name: </h3><input onChange={event => this.handleInputChange(event)} className='newTeamName' name='name' maxLength='32' />
                                <h3>Description: </h3><textarea className='description' name='description' maxLength='500' onChange={(event) => this.handleInputChange(event)} value={this.state.description} />
                                <button onClick={() => this.createTeam()}>Create Team</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className='login'>
                    Please login first
                    <Link to='/'>Login</Link>
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

export default connect(mapStateToProps, { updateUser, updateTeam })(NewTeam)