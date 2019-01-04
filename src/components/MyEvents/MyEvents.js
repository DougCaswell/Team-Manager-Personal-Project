import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { updateTeam, updateUser } from '../../ducks/reducer';
import './MyEvents.css';

class MyEvents extends Component {
    constructor() {
        super()
        this.state = {
            activeEvent: {}
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

    activateDetails(event) {
        this.setState({
            activeEvent: event
        })
    }

    render() {
        if (this.props.user.events) {
            if (!this.props.user.events[0]) { return <div className='loading'>No Events Scheduled</div> }
            const mappedEvents = this.props.user.events.map(event => {
                let { id, name, date, time } = event
                date = this.formatDate(date)
                time = this.formatTime(time)
                return (
                    <div onClick={() => this.activateDetails({ ...event, date, time })} key={id} className='event'>
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
                                    {mappedEvents}
                                </div>
                                <div className='activeEventDetailsBox'>
                                    <h2>Details</h2>
                                    {this.state.activeEvent.id ? (
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
                                        </div>
                                    ) : (
                                            <h2 className='activeEventDetails'>Select an event on the left to view details</h2>
                                        )}
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
    }
}

const mapStateToProps = (reduxState) => {
    return (
        { ...reduxState }
    )
}

export default connect(mapStateToProps, { updateTeam, updateUser })(MyEvents)