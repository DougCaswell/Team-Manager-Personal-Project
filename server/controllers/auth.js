const bcrypt = require('bcryptjs');
const randomString = require('randomstring')
const nodemailer = require('nodemailer');

const { USER, PASS, REACT_APP_LOGIN } = process.env

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: USER,
        pass: PASS
    },
    tls: true
});

module.exports = {

    login: async (req, res) => {
        const { email, password } = req.body;
        const db = req.app.get('db');
        const user = await db.find_user([email])
        if (!user[0]) {
            return res.status(200).send({ loggedIn: false, message: 'Need to register that email first' })
        }
        let result = bcrypt.compareSync(password, user[0].hash)
        if (!result) {
            return res.status(401).send({ loggedIn: false, message: 'Incorrect password' })
        }
        if (!user[0].active) {
            req.session.user = { ...user[0] }
            return res.status(200).send({ loggedIn: false, message: 'Inactive Account', user: req.session.user })
        }
        if (result) {
            req.session.user = { ...user[0] }
            return res.status(200).send({ loggedIn: true, message: 'Logged in', user: req.session.user })
        }

    },

    register: async (req, res) => {
        const { email, password } = req.body;
        const db = req.app.get('db');
        const user = await db.find_user([email])
        if (user[0]) {
            return res.status(200).send({ loggedIn: false, message: 'That email is already in use, please go to the login page to login' })
        } else {
            const confirmationCode = randomString.generate()
            let salt = bcrypt.genSaltSync()
            let hash = bcrypt.hashSync(password, salt);
            let createdUser = await db.create_user([email, hash, confirmationCode])
            req.session.user = createdUser[0]
            let mailOptions = {
                from: 'doug.teammanager@gmail.com',
                to: email,
                subject: `Welcome`,
                html: `<h1>Welcome</h1><h2>New User</h2><p>This is Team Manager.  A web application designed to make it easy for team members to connect with each other and keep their teams organized.  <h3>Please note that this application is currently not a permanent product.  It may be changed, updated, or removed at any time.</h3>  To activate your new account, if you are still on the register page, you can enter the confirmation code there.  Otherwise, go to ${REACT_APP_LOGIN} and enter in your account info.  This is a one time process.  You won't need the confirmation code after activating your account.</h3><h3>Confirmation Code: <p>${confirmationCode}</p></h3><p>After successfully logging in, you can update your profile information and password on the profile page if you would like. You can now create a team, or if invited, be able to see your pending team invites and accept or decline them on the invite page. Team managers can create events for their teams, and all team team members can chat with others in their chat rooms.</p><h3>This is a project created by Doug Caswell.  For questions and comments about this project, please send your emails to doug.teammanager@gmail.com</h3>`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    return res.sendStatus(500)
                } else {
                    console.log(info);
                }
            });
            res.status(201).send({ loggedIn: false, message: 'New user successfully created', user: req.session.user })
        }
    },

    logout: (req, res) => {
        req.session.destroy();
        res.status(200).send({ loggedIn: false, message: 'Logged out' })
    },

    checkCode: async (req, res) => {
        const { confirmationCode, email } = req.body
        const db = req.app.get('db')
        user = await db.find_user([email])
        if (user[0].confirmation_code === confirmationCode) {
            const activeUser = await db.activate_user([user[0].id])
            req.session.user = activeUser[0]
            res.status(200).send({ loggedIn: true, message: 'User Activated', user: req.session.user })
        } else {
            return res.status(200).send({ message: 'Incorrect Confirmation Code' })
        }
    },

    changePassword: async (req, res) => {
        const { user } = req.session
        if (!user) {
            console.log(error)
            return res.status(401).send('Must login first')
        }
        const { password, newPassword, email } = req.body
        const db = req.app.get('db')
        const thisUser = await db.find_user([email])
        const result = bcrypt.compareSync(password, thisUser[0].hash)
        if (!result) {
            return res.status(200).send({ passwordUpdated: false, message: 'Incorrect password' })
        }
        const salt = bcrypt.genSaltSync()
        const hash = bcrypt.hashSync(newPassword, salt);
        const updatedUser = await db.update_password([user.id, hash])
        req.session.user = updatedUser[0]
        return res.status(200).send({ passwordUpdated: true, message: 'Updated Password', user: req.session.user })
    }
}