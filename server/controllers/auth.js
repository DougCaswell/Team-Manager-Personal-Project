const bcrypt = require('bcryptjs');

module.exports = {

    login: async (req, res) => {
        const { email, password } = req.body;
        const db = req.app.get('db');
        const user = await db.find_user([email])
        if (!user[0]) {
            return res.status(200).send({ loggedIn: false, message: 'Need to register that email first' })
        }
        let result = bcrypt.compareSync(password, user[0].hash)
        if (result) {
            req.session.user = { ...user[0] }
            return res.status(200).send({ loggedIn: true, message: 'Logged in', user: req.session.user })
        } else {
            return res.status(401).send({ loggedIn: false, message: 'Incorrect password' })
        }

    },

    register: async (req, res) => {
        const { email, password } = req.body;
        const db = req.app.get('db');
        const user = await db.find_user([email])
        if (user[0]) {
            return res.status(200).send({ loggedIn: false, message: 'That email is already in use' })
        } else {
            let salt = bcrypt.genSaltSync()
            let hash = bcrypt.hashSync(password, salt);
            let createdUser = await db.create_user([email, hash])
            req.session.user = createdUser[0]
            res.status(201).send({ loggedIn: true, message: 'New user successfully created', user: req.session.user })
        }
    },

    logout: (req, res) => {
        req.session.destroy();
        res.status(200).send({ loggedIn: false, message: 'Logged out' })
    }
}