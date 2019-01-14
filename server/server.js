require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const socket = require('socket.io');
const auth = require('./controllers/auth');
const user = require('./controllers/user');
const team = require('./controllers/team');
const event = require('./controllers/event');
const invite = require('./controllers/invite');
const path = require('path');

const { SERVER_PORT, CONNECTION_STRING, SECRET, DEV } = process.env;

const app = express();
const io = socket(app.listen(SERVER_PORT, () => {
    console.log('now listening on port', SERVER_PORT)
}));

app.use(express.json())


app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}));

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
});



app.use(async (req, res, next) => {
    if (DEV === 'true') {
        let db = req.app.get('db');
        let user = await db.session_user();
        req.session.user = user[0];
        next();
    } else {
        next();
    };
});

app.use(express.static(`${__dirname}/../build`));


app.post('/auth/register', auth.register)
app.post('/auth/login', auth.login)
app.post('/auth/code', auth.checkCode)
app.post('/auth/password', auth.changePassword)
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

app.get('/api/invite', invite.getInvites)
app.post('/api/invite', invite.sendInvite)
app.post('/api/invite/answer', invite.answerInvite)


io.on('connection', socket => {
    console.log('User Connected')
    
    socket.on('load messages', async data => {
        const { team_id, user_id, room } = data
        if (!user_id) { return io.emit('ERROR', { message: 'You must login first' }) }
        const db = app.get('db')
        const onTeam = await db.find_user_on_team([team_id, user_id])
        if (!onTeam[0]) { return io.emit('ERROR', { message: "You are not on this team!" }) }
        socket.join(room)
        let messages = await db.get_messages([team_id])
        io.to(room).emit('get messages', messages)
    });
    
    socket.on('message sent', async data => {
        const { team_id, user_id, message } = data
        if (!user_id) { return io.emit('ERROR', { message: 'You must login first' }) }
        const db = app.get('db')
        const onTeam = await db.find_user_on_team([team_id, user_id])
        if (!onTeam[0]) { return io.emit('ERROR', { message: "You are not on this team!" }) }
        await db.create_message([team_id, user_id, message])
        const messages = await db.get_messages([team_id])
        io.emit('get messages', messages)
    });
    
    socket.on('disconnect', () => {
        console.log('User Disconnected')
    })
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

