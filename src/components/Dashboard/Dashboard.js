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
                email: '',
                full_name: '',
                phone: '',
                preferred_contact_method: '',
                profile_picture_url: '',
                displayed_name: '',
            },
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
                preferred_contact_method: SQLuser.prefered_contact_method || '',
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

    handleInputChange(event) {
        this.setState({
            user: { ...this.state.user, [event.target.name]: event.target.value }
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
                }
            }
        );
        this.toggleEdit()
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
                                        <h2>Preferred Contact Method: {this.props.user.prefered_contact_method || '?'}</h2>
                                    </div>
                                </div>
                                <button onClick={() => this.toggleEdit()}>Edit Profile</button>
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
                                <button className='changeProfilePicture' onClick={() => this.changeProfilePicture()}>
                                    Change Profile Picture
                            </button>

                                <h2>E-mail:</h2><input type='email' required maxLength='64' value={this.state.user.email} onChange={event => this.handleInputChange(event)} name='email' />
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
    return { ...reduxState }
}

export default connect(mapStateToProps, { updateUser })(Dashboard)