import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { updateUser } from '../../ducks/reducer';
// import defaultPhoto from './defaultPhoto.svg';
import './Dashboard.css';
import { Image } from 'cloudinary-react';

class Dashboard extends Component {
    constructor() {
        super()
        this.state = {
            user: {
                full_name: '',
                phone: '',
                preferred_contact_method: '',
                profile_picture_url: '',
                displayed_name: '',
            },
            password: '',
            newPassword: '',
            changePassword: false,
            edit: false
        }
    }

    async componentDidMount() {
        const res = await axios.get('/api/user')
        const SQLuser = res.data
        this.props.updateUser(SQLuser)
        this.setState({
            user: {
                email: SQLuser.email,
                full_name: SQLuser.full_name || '',
                phone: SQLuser.phone || '',
                preferred_contact_method: SQLuser.preferred_contact_method || '',
                profile_picture_url: SQLuser.profile_picture_url || 'atlgolkdai0csdwtxu2h',
                displayed_name: SQLuser.displayed_name || ''
            }
        })
    }

    toggleEdit() {
        this.setState({
            edit: !this.state.edit
        })
    }

    toggleChangePassword() {
        this.setState({
            changePassword: !this.state.changePassword
        })
    }

    async changePassword() {
        if (!this.state.password || !this.state.newPassword) {
            return alert('Password inputs cannot be blank')
        }
        const { password, newPassword } = this.state
        const res = await axios.post('/auth/password', { password, newPassword, email: this.props.user.email })
        if (!res.data.passwordUpdated) {
            this.setState({
                password: '',
                newPassword: ''
            })
            return alert(res.data.message)
        } else if (res.data.passwordUpdated) {
            this.props.updateUser(res.data.user)
            this.setState({
                password: '',
                newPassword: '',
                changePassword: false,
                edit: false
            })
        } else {
            alert('error')
        }
    }

    handleInputChange(event) {
        this.setState({
            user: { ...this.state.user, [event.target.name]: event.target.value }
        })
    }

    handlePasswordChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    async editProfile() {
        const { user } = this.state;
        const res = await axios.post('/api/user', user)
        this.props.updateUser(res.data)
        this.toggleEdit()
    }

    changeProfilePicture() {
        window.cloudinary.openUploadWidget(
            { cloud_name: 'djqtnii8i', upload_preset: 'ivza2vul', tags: ['profile'] },
            (error, result) => {
                if (result) {
                    this.setState({
                        user: { ...this.state.user, profile_picture_url: result[0].public_id }
                    })
                } else {
                    console.log(error)
                }
            }
        );
    }


    render() {
        const { user } = this.props
        if (user.email) {
            if (!this.state.edit) {
                return (
                    <div className='Dashboard'>
                        <div className='navPlaceHolder'></div>
                        <div className='container'>
                            <div className='myHeader'>
                                <h1>Profile</h1>
                            </div>
                            <div className='myDashboardContainer'>
                                <Image cloudName='djqtnii8i' publicId={this.state.user.profile_picture_url} />
                                <h2>E-mail: {this.props.user.email}</h2>
                                <div className='profileInfo'>
                                    <div className='left'>
                                        <h2>Displayed Name: {this.props.user.displayed_name || '?'}</h2>
                                        <h2>Full Name: {this.props.user.full_name || '?'}</h2>
                                    </div>
                                    <div className='right' >
                                        <h2>Phone Number: {this.props.user.phone || '?'}</h2>
                                        <h2>Preferred Contact Method: {this.props.user.preferred_contact_method || '?'}</h2>
                                    </div>
                                </div>
                                <button onClick={() => this.toggleEdit()}>Edit Profile</button>
                            </div>
                        </div>
                    </div>
                )
            } else {
                if (this.state.changePassword) {
                    return (
                        <div className='Dashboard'>
                            <div className='navPlaceHolder'></div>
                            <div className='container'>
                                <div className='myHeader'>
                                    <h1>Profile</h1>
                                </div>
                                <div className='myDashboardContainer'>
                                    <div className='changePassword'>
                                        <h2>Old Password</h2>
                                        <input type='password' name='password' onChange={event => this.handlePasswordChange(event)} value={this.state.password} />
                                        <h2>New Password</h2>
                                        <input type='password' name='newPassword' onChange={event => this.handlePasswordChange(event)} value={this.state.newPassword} />
                                        <div className='horizontalInputButton'>
                                            <button onClick={() => this.changePassword()}>Save</button>
                                            <button onClick={() => this.toggleChangePassword()}>Go back</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div className='Dashboard'>
                            <div className='navPlaceHolder'></div>
                            <div className='container'>
                                <div className='myHeader'>
                                    <h1>Profile</h1>
                                </div>
                                <div className='myDashboardContainer'>
                                    <div className='importantButtons'>
                                        <button className='changeProfilePicture' onClick={() => this.changeProfilePicture()}>
                                            Change Profile Picture
                                        </button>
                                        <button onClick={() => this.toggleChangePassword()}>
                                            Change Password
                                        </button>
                                    </div>
                                    <div className='profileInfo'>
                                        <div className='left'>
                                            <h2>Displayed Name:</h2><input maxLength='40' value={this.state.user.displayed_name} onChange={event => this.handleInputChange(event)} name='displayed_name' />
                                            <h2>Full Name:</h2><input maxLength='64' value={this.state.user.full_name} onChange={event => this.handleInputChange(event)} name='full_name' />
                                        </div>
                                        <div className='right'>
                                            <h2>Phone Number:</h2><input type="text" value={this.state.user.phone} onChange={event => this.handleInputChange(event)} name='phone' />
                                            <h2>Preferred Contact Method:</h2><input maxLength='20' value={this.state.user.preferred_contact_method} onChange={event => this.handleInputChange(event)} name='preferred_contact_method' />
                                        </div>
                                    </div>
                                    <button onClick={() => this.editProfile()}>Save Changes</button>
                                </div>
                            </div>
                        </div>
                    )
                }
            }
        } else {
            return (
                <div className='Dashboard'>
                    <div className='navPlaceHolder'></div>
                    <div className='container'>
                        <div className='myHeader'>
                            <h1>Profile</h1>
                        </div>
                        <div className='login'>
                            Please login first
                    <Link to='/'>Login</Link>
                        </div>
                    </div>
                </div>
            )
        }

    }
}

const mapStateToProps = (reduxState) => {
    return { ...reduxState }
}

export default connect(mapStateToProps, { updateUser })(Dashboard)