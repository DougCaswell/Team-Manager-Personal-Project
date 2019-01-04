require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const auth = require('./controllers/auth');
const user = require('./controllers/user');
const team = require('./controllers/team');
const event = require('./controllers/event');

const { SERVER_PORT, CONNECTION_STRING, SECRET, DEV } = process.env;

const app = express();

app.use(express.json())


app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(async function authBypass(req, res, next) {
    if (DEV === 'true') {
        let db = req.app.get('db');
        let user = await db.session_user();
        req.session.user = user[0];
        next();
    } else {
        next();
    };
});

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    app.listen(SERVER_PORT, () => {
        console.log('listening on port ', SERVER_PORT)
    });
});

app.post('/auth/register', auth.register)
app.post('/auth/login', auth.login)
app.get('/auth/logout', auth.logout)

app.get('/api/user', user.getUser)
app.post('/api/user', user.editProfile)

app.post('/api/team/new', team.newTeam)
app.get('/api/team/:teamid', team.getMyTeam)
app.post('/api/team/member', team.addMember)
app.post('/api/team/teams', team.getTeams)
app.post('/api/team/name', team.editTeamName)
app.post('/api/team/description', team.editTeamDescription)
app.post('/api/team/manager', team.editTeamManager)
app.post('/api/team/remove', team.removeMember)
app.post('/api/team/delete', team.deleteTeam)
app.post('/api/team/leave', team.leaveTeam)

app.post('/api/event/new', event.newEvent)
app.get('/api/events', event.getEvents)
app.post('/api/events/edit', event.editEvent)
app.post('/api/events/delete', event.deleteEvent)