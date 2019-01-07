import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css'
import linked from './linked.svg'
import {connect} from 'react-redux';
import {updateUser} from '../../ducks/reducer';

class Login extends Component {
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

    async login() {
        const { email, password } = this.state;
        if (!email || !password) {
            return alert('Must have username and password fields filled out')
        }
        const res = await axios.post('/auth/login', { email, password })
        this.setState({
            email: '',
            password: ''
        })
        if (res.data.loggedIn) {
            this.props.updateUser(res.data.user)
            this.props.history.push('/profile')
        }
    }

    render() {
        return (
            <div className='LoginPage'>
                <h1>Team Manager</h1>
                <div className='LoginInputs'>
                    <h3>My account</h3>
                    <Link to='/register'>Don't have an account yet?</Link>
                    E-mail <input spellCheck='false' name='email' onChange={event => this.handleInputChange(event)} value={this.state.email} />
                    Password <input type='password' name='password' onChange={event => this.handleInputChange(event)} value={this.state.password} />
                    <button onClick={event => this.login()} >Login</button>
                    
                </div>
                <img className='linked' src={linked} alt='' />
            </div>
        )
    }
}

export default connect(null, {updateUser})(Login)