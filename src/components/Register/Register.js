import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import linked from './linked.svg';
import './Register.css'
import {connect} from 'react-redux';
import {updateUser} from '../../ducks/reducer';

class Register extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            password: ''
        }
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    async register() {
        const { email, password } = this.state
        const res = await axios.post('./auth/register', { email, password })
        this.setState({
            email: '',
            password: ''
        })
        this.props.updateUser(res.data.user)
        if (res.data.loggedIn) {
            this.props.history.push('/profile')
        }
    }

    render() {
        return (
            <div className='RegisterPage'>
                <h1>Team Manager</h1>
                <div className='RegisterInputs'>
                    <h3>Create account</h3>
                    <Link to='/'>Already have an account?</Link>
                    E-mail <input spellCheck='false' name='email' onChange={event => this.handleInputChange(event)} value={this.state.email} />
                    Password <input type='password' name='password' onChange={event => this.handleInputChange(event)} value={this.state.password} />
                    <button onClick={event => this.register()} >Register</button>
                    
                </div>
                <img className='linked' src={linked} alt='' />
            </div>
        )
    }
}

export default connect(null, {updateUser})(Register)