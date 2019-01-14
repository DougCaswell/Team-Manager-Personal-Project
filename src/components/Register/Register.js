import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import linked from './linked.svg';
import './Register.css'
import { connect } from 'react-redux';
import { updateUser } from '../../ducks/reducer';

class Register extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            password: '',
            confirmationCodeView: false,
            confirmationCode: ''
        }
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    async register() {
        const { email, password } = this.state
        if (!email || !password) {
            return alert('Must have username and password fields filled out')
        }
        const res = await axios.post('/auth/register', { email, password })
        if (res.data.user) {
            this.props.updateUser(res.data.user)
            this.setState({
                password: '',
                confirmationCodeView: true
            })
        } else {
            this.setState({
                email: '',
                password: '',
            })
            alert(res.data.message)
        }
    }

    async checkCode() {
        const res = await axios.post('/auth/code', { confirmationCode: this.state.confirmationCode, email: this.state.email })
        if (res.data.loggedIn) {
            this.setState({
                confirmationCode: '',
            })
            this.props.updateUser(res.data.user)
            this.props.history.push('/profile')
        } else {
            alert(res.data.message)
            this.setState({
                confirmationCode: '',
            })
        }
    }

    render() {
        return (
            <div className='RegisterPage'>
                <h1>Team Manager</h1>
                {!this.state.confirmationCodeView ? (
                    <div className='RegisterInputs'>
                        <h3>Create account</h3>
                        <Link to='/'>Already have an account?</Link>
                        E-mail <input spellCheck='false' name='email' onChange={event => this.handleInputChange(event)} value={this.state.email} />
                        Password <input type='password' name='password' onChange={event => this.handleInputChange(event)} value={this.state.password} />
                        <button onClick={() => this.register()} >Register</button>
                    </div>
                ) : (
                        <div className='RegisterInputs'>
                            <h3>Thank You For Registering</h3>
                            <p>To finish the process, please enter the confirmation code sent to your email below</p>
                            Confirmation Code <input value={this.state.confirmationCode} name='confirmationCode' onChange={event => this.handleInputChange(event)}></input>
                            <button onClick={() => this.checkCode()}>Activate Account</button>
                        </div>
                    )}
                <img className='linked' src={linked} alt='' />
            </div>
        )
    }
}

export default connect(null, { updateUser })(Register)