import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { updateTeam, updateUser } from '../../ducks/reducer';
import './NewEvent.css';
import { Link } from 'react-router-dom';

class NewEvent extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            description: '',
            addressLineOne: '',
            addressLineTwo: '',
            addressLineThree: '',
            city: '',
            state: '',
            zipCode: '',
            mandetory: false,
            date: '',
            time: '',
        }
    }

    async componentDidMount() {
        const teamId = this.props.match.params.teamid
        const userRes = await axios.get('/api/user')
        this.props.updateUser(userRes.data)
        const teamRes = await axios.get(`/api/team/${teamId}`)
        this.props.updateTeam(teamRes.data)
        let now = new Date();
        let month = (now.getMonth() + 1);
        let day = now.getDate();
        let hour = now.getHours();
        let minute = now.getMinutes();
        if (month < 10)
            month = "0" + month;
        if (day < 10) { day = "0" + day };
        if (hour < 10) { hour = "0" + hour };
        if (minute < 10) { minute = "0" + minute };
        if (minute < 0) { minute = "0" + minute }
        let thisTime = `${hour}:${minute}`
        let today = now.getFullYear() + '-' + month + '-' + day;
        this.setState({
            date: today,
            time: thisTime
        })
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    toggleMandetory() {
        this.setState({
            mandetory: !this.state.mandetory
        })
    }
    async createEvent() {
        const { name, description, addressLineOne, addressLineTwo, addressLineThree, city, state, zipCode, mandetory, date, time } = this.state
        if (!name || !date || !time) { return alert('Event needs atleast a name, date, and time') }
        const res = await axios.post('/api/event/new', { name, description, addressLineOne, addressLineTwo, addressLineThree, city, state, zipCode, mandetory, date, time })
        if (res.data.events) {
            this.props.updateTeam(res.data)
            this.props.history.push('/myevents')
        }
    }

    render() {
        if (this.props.user.email) {

            if (this.props.user.id === this.props.team.team_manager) {
                return (
                    <div className='newEvent'>
                        <div className='navPlaceHolder'></div>
                        <div className='container'>
                            <div className='myHeader'>
                                <h1>New Event For Team: {this.props.team.name}</h1>
                            </div>
                            <div className='myNewEventContainer'>
                                <div className='eventForm'>
                                    <div className='basicInfo'>
                                        <h2>Name</h2>
                                        <input placeholder='Event Name' name='name' maxLength='32' onChange={(event) => this.handleInputChange(event)} value={this.state.name} />
                                        <h2>Description</h2>
                                        <textarea placeholder='Click and drag the bottom right corner to resize' className='description' name='description' maxLength='500' onChange={(event) => this.handleInputChange(event)} value={this.state.description} />
                                        <h2>Date</h2>
                                        <input type='date' name='date' onChange={(event) => this.handleInputChange(event)} value={this.state.date} />
                                    </div>
                                    <div className='where'>
                                        <h2>Address Line 1</h2>
                                        <input placeholder='Address Line 1' name='addressLineOne' maxLength='32' onChange={(event) => this.handleInputChange(event)} value={this.state.addressLineOne} />
                                        <h2>Address Line 2</h2>
                                        <input placeholder='Address Line 2' name='addressLineTwo' maxLength='32' onChange={(event) => this.handleInputChange(event)} value={this.state.addressLineTwo} />
                                        <h2>Address Line 3</h2>
                                        <input placeholder='Address Line 3' name='addressLineThree' maxLength='32' onChange={(event) => this.handleInputChange(event)} value={this.state.addressLineThree} />
                                        <h2>Time</h2>
                                        <input type='time' name='time' onChange={(event) => this.handleInputChange(event)} value={this.state.time} />
                                        <button onClick={() => this.createEvent()}>Create</button>
                                    </div>
                                    <div className='other'>
                                        <h2>City</h2>
                                        <input placeholder='City' name='city' maxLength='32' onChange={(event) => this.handleInputChange(event)} value={this.state.city} />
                                        <h2>State</h2>
                                        <input placeholder='State' name='state' maxLength='2' onChange={(event) => this.handleInputChange(event)} value={this.state.state} />
                                        <h2>Zip Code</h2>
                                        <input placeholder='Zip Code' type='number' name='zipCode' onChange={(event) => this.handleInputChange(event)} value={this.state.zipCode} />
                                        <h2>Mandetory</h2>
                                        <div className='mandetory'>
                                            <input type='radio' name='mandetory' onChange={(event) => this.handleInputChange(event)} value={true} /> Yes
                                            <input type='radio' name='mandetory' defaultChecked={!this.state.mandetory} onChange={(event) => this.handleInputChange(event)} value={false} /> No
                                        </div>
                                    </div>
                                </div>
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
                <div className='Dashboard'>
                    <div className='navPlaceHolder'></div>
                    <div className='container'>
                        <div className='myHeader'>
                            <h1>New Event</h1>
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

export default connect(mapStateToProps, { updateTeam, updateUser })(NewEvent);