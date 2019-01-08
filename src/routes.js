import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import MyTeam from './components/MyTeam/MyTeam';
import NewTeam from './components/NewTeam/NewTeam';
import Register from './components/Register/Register';
import NewEvent from './components/NewEvent/NewEvent';
import MyEvents from './components/MyEvents/MyEvents';
import TeamChat from './components/TeamChat/TeamChat';

export default (
    <Switch>
        <Route exact path='/' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/profile' component={Dashboard} />
        <Route path='/myteam/:teamid' component={MyTeam} />
        <Route path='/newteam' component={NewTeam} />
        <Route path='/newevent/:teamid' component={NewEvent} />
        <Route path='/myevents' component={MyEvents} />
        <Route path='/chat/:teamid' component={TeamChat} />
    </Switch>
)