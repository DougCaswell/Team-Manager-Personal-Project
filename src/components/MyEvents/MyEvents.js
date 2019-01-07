import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { updateTeam, updateUser } from '../../ducks/reducer';
import './MyEvents.css';

class MyEvents extends Component {
    constructor() {
        super()
        this.state = {
            activeEvent: {},
            edit: false,
            name: '',
            date: '',
            time: '',
            mandetory: false,
            description: '',
            address_line_one: '',
            address_line_two: '',
            address_line_three: '',
            city: '',
            state: '',
            zip_code: ''
        }
    }

    async componentDidMount() {
        const userRes = await axios.get('/api/user')
        this.props.updateUser(userRes.data)
        const eventRes = await axios.get('/api/events')
        this.props.updateUser(eventRes.data)
    }

    formatDate(date) {
        let str = date.split('')
        str.splice(10, str.length - 10)
        const newDate = str.join('')
        return newDate
    }

    formatTime(time) {
        let str = time.split('')
        str.splice(str.length - 3, 3)
        const armyTime = str.join('')
        let str2 = armyTime.split(':')
        str2.splice(1, 0, ':')
        if (str2[0] > 12) {
            str2[0] = str2[0] - 12
            str2.push(' PM')
        } else {
            str2.push(' AM')
        }
        const newTime = str2.join('')
        return newTime
    }

    activateDetails(event, time) {
        this.setState({
            activeEvent: event,
            edit: false,
            name: event.name,
            date: event.date,
            time: time,
            mandetory: event.mandetory,
            description: event.description || '',
            address_line_one: event.address_line_one || '',
            address_line_two: event.address_line_two || '',
            address_line_three: event.address_line_three || '',
            city: event.city || '',
            state: event.state || '',
            zip_code: event.zip_code || '',
        })
    }

    onEdit() {
        this.setState({
            edit: true
        })
    }

    async saveChanges() {
        const { name, date, time, mandetory, description, address_line_one, address_line_two, address_line_three, city, state, zip_code } = this.state
        const { id, team_manager } = this.state.activeEvent
        const res = await axios.post('/api/events/edit', { id, team_manager, name, date, time, mandetory, description, address_line_one, address_line_two, address_line_three, city, state, zip_code })
        this.props.updateUser(res.data)
        const index = this.props.user.events.findIndex(event => event.id === id)
        const activeEvent = this.props.user.events[index]
        this.setState({
            activeEvent: {...activeEvent, date: this.formatDate(activeEvent.date), time: this.formatTime(activeEvent.time)},
            edit: false
        })
    }

    async deleteEvent() {
        const { id, team_manager } = this.state.activeEvent
        const res = await axios.post('/api/events/delete', {id, team_manager})
        this.props.updateUser(res.data)
        this.setState({
            activeEvent: {},
        })
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        if (this.props.user.events) {
            if (!this.props.user.events[0]) { return <div className='loading'>No Events Scheduled</div> }
            const mappedEvents = this.props.user.events.map(event => {
                let { id, name, date, time } = event
                let unformattedTime = time
                date = this.formatDate(date)
                time = this.formatTime(time)

                return (
                    <div onClick={() => this.activateDetails({ ...event, date, time }, unformattedTime)} key={id} className='event'>
                        <h2>{name}</h2>
                        <div className='when'>
                            <h2>{date}</h2>
                            <h2>{time}</h2>
                        </div>
                    </div>
                )
            })
            return (
                <div className='myEvents'>
                    <div className='navPlaceHolder'></div>
                    <div className='container'>
                        <div className='myHeader'>
                            <h1>My Events</h1>
                        </div>
                        <div className='myEventsContainer'>
                            <div className='eventsBox'>
                                <div className='events'>
                                    <div className='eventHeader'>
                                        <h2>Event</h2>
                                    </div>
                                    <div className='mappedEvents'>
                                        {mappedEvents}
                                    </div>
                                </div>
                                <div className='activeEventDetailsBox'>
                                    <h2>Details</h2>
                                    {!this.state.activeEvent.id ? (
                                        <h2 className='activeEventDetails'>Select an event on the left to view details</h2>
                                    ) : <div></div>}
                                    {this.state.activeEvent.id && !this.state.edit ? (
                                        <div className='activeEventDetails'>
                                            <div className='eventHeader'>
                                                <div className='activeEventName'>
                                                    <h3 className='first'>Name</h3>
                                                    <p>{`${this.state.activeEvent.name}`}</p>
                                                    <h3>Team</h3>
                                                    <p>{`${this.state.activeEvent.team_name}`}</p>
                                                </div>
                                                <div className='activeEventTime'>
                                                    <h3 className='first'>{`${this.state.activeEvent.date}`}</h3>
                                                    <h3>{`${this.state.activeEvent.time}`}</h3>
                                                </div>
                                            </div>
                                            {this.state.activeEvent.mandetory ? <div className='myEventMandetory'><h3>This is Mandetory!</h3></div> : <div></div>}
                                            <div className='eventDescription'>
                                                <h3>Description</h3>
                                                <p>{this.state.activeEvent.description || 'No description for this event'}</p>
                                            </div>
                                            <div className='eventPlace'>
                                                <h3>Location</h3>
                                                {(this.state.activeEvent.address_line_one || this.state.activeEvent.address_line_two || this.state.activeEvent.address_line_three || this.state.activeEvent.city || this.state.activeEvent.state || this.state.activeEvent.zip_code) ? (
                                                    <div className='address'>
                                                        <h4>Street Address:</h4>
                                                        <p>{this.state.activeEvent.address_line_one}</p>
                                                        <p>{this.state.activeEvent.address_line_two}</p>
                                                        <p>{this.state.activeEvent.address_line_three}</p>
                                                        <div id='cityState'>
                                                            <h4>City</h4><h4>State</h4><h4>Zip Code</h4>
                                                        </div>
                                                        <div id='cityStateValue'>
                                                            <p>{this.state.activeEvent.city || ''}</p>
                                                            <p>{this.state.activeEvent.state || ''}</p>
                                                            <p>{this.state.activeEvent.zip_code || ''}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                        <p>No location provided</p>
                                                    )}
                                            </div>
                                            {this.state.activeEvent.team_manager === this.props.user.id ? (
                                                <div className='editEventButtonSection'>
                                                    {this.state.edit ? (
                                                        <div></div>
                                                    ) : (
                                                            <div className='editEventButtons'>
                                                                <button onClick={() => this.onEdit()}>Edit Event</button>
                                                                <button onClick={() => this.deleteEvent()}>Delete Event</button>
                                                            </div>
                                                        )}
                                                </div>
                                            ) : <div></div>}
                                        </div>
                                    ) : (
                                            <div></div>
                                        )}
                                    {this.state.edit ? (
                                        <div className='editEventSection'>
                                            <div className='activeEventDetails'>
                                                <div className='eventHeader'>
                                                    <div className='activeEventName'>
                                                        <h3 className='first'>Name</h3>
                                                        <input maxLength='32' value={this.state.name} name='name' onChange={event => this.handleInputChange(event)} />
                                                        <h3>Team</h3>
                                                        <p>{`${this.state.activeEvent.team_name}`}</p>
                                                    </div>
                                                    <div className='activeEventTime'>
                                                        <h3 className='first'>Date and Time</h3>
                                                        <input type='date' value={this.state.date} onChange={event => this.handleInputChange(event)} name='date' />
                                                        <input type='time' value={this.state.time} onChange={event => this.handleInputChange(event)} name='time' />
                                                    </div>
                                                </div>
                                                <div className='myEventMandetory'>
                                                    <h3>Mandetory?</h3>
                                                    <div className='mandetory'>
                                                        <input type='radio' name='mandetory' defaultChecked={this.state.mandetory} onChange={(event) => this.handleInputChange(event)} value={true} /> Yes
                                                        <input type='radio' name='mandetory' defaultChecked={!this.state.mandetory} onChange={(event) => this.handleInputChange(event)} value={false} /> No
                                                    </div>
                                                </div>
                                                <div className='eventDescription'>
                                                    <h3>Description</h3>
                                                    <textarea maxLength='500' value={this.state.description} name='description' onChange={event => this.handleInputChange(event)} />
                                                </div>
                                                <div className='eventPlace'>
                                                    <h3>Location</h3>
                                                    <div className='address'>
                                                        <h4>Street Address:</h4>
                                                        <input maxLength='32' value={this.state.address_line_one} name='address_line_one' onChange={event => this.handleInputChange(event)} />
                                                        <input maxLength='32' value={this.state.address_line_two} name='address_line_two' onChange={event => this.handleInputChange(event)} />
                                                        <input maxLength='32' value={this.state.address_line_three} name='address_line_three' onChange={event => this.handleInputChange(event)} />
                                                        <div id='cityState'>
                                                            <h4>City</h4><h4>State</h4><h4>Zip Code</h4>
                                                        </div>
                                                        <div id='cityStateValue'>
                                                            <input maxLength='32' name='city' value={this.state.city} onChange={event => this.handleInputChange(event)} />
                                                            <input maxLength='2' name='state' value={this.state.state} onChange={event => this.handleInputChange(event)} />
                                                            <input type='number' name='zip_code' value={this.state.zip_code} onChange={event => this.handleInputChange(event)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='editEventButtons'>
                                                    <button onClick={() => this.saveChanges()}>Save Changes</button>
                                                </div>
                                            </div>

                                        </div>
                                    ) : <div></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
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
    }
}

const mapStateToProps = (reduxState) => {
    return (
        { ...reduxState }
    )
}

export default connect(mapStateToProps, { updateTeam, updateUser })(MyEvents)