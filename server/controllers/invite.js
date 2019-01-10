require('dotenv').config();
const randomString = require('randomstring')
const nodemailer = require('nodemailer');

const { USER, PASS, REACT_APP_LOGIN } = process.env

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: USER,
        pass: PASS
    }
});

module.exports = {
    sendInvite: async (req, res) => {
        if (!req.session.user) { return res.status(401).send('Must be logged in to send invite') }
        if (req.session.user.id !== req.session.team.team_manager) { return res.status(401).send('Only the team manager can invite members to team') }
        const { email } = req.body
        const db = req.app.get('db')
        const user = await db.find_user([email])
        if (!user) {
            confirmationCode = randomString.generate()
            presetPassword = randomstring.generate()
            let salt = bcrypt.genSaltSync()
            let hash = bcrypt.hashSync(presetPassword, salt);
            await db.create_user([email, hash])
            let mailOptions = {
                from: 'doug.teammanager@gmail.com',
                to: email,
                subject: `You have been invited to join ${req.session.team.name}`,
                html: `<h1>Welcome</h1><h2>New User</h2><p>This is Team Manager.  A web application designed to make it easy for team members to connect with each other and keep their teams organized.  You were invited to join one of our teams. ${req.session.team.name}.  To complete joining this team, go to ${REACT_APP_LOGIN} and enter the following information.</p><h3>Email: ${email}</h3><h3>Password ${presetPassword}</h3><h3>Confirmation Code ${confirmationCode}</h3><p>After successfully logging in, you can update your profile information and password on the profile page if you would like.  You will also be able to see your pending team invites and accept or decline them on the invite page.</p><h6>This is a project created by Doug Caswell.  For questions and comments about this project, please send your emails to doug.teammanager@gmail.com</h6>`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    return res.sendStatus(500)
                } else {
                    console.log(info);
                    return res.status(200).send({ message: 'Invite Sent' })
                }
            });
        }
        const onTeam = await db.find_user_on_team([req.session.team.id, user[0].id])
        if (onTeam[0]) { return res.status(401).send('User already on team') }
        const check = await db.check_invites([req.session.team.id, user[0].id])
        if (check[0]) { return res.status(401).send('User has already been invited') }
        await db.create_invite([req.session.team.id, user[0].id])
        return res.status(200).send({ message: 'Invite Sent' })
    },
    answerInvite: (req, res) => {

    }
}