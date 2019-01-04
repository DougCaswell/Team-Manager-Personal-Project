module.exports = {
    newEvent: async (req, res) => {
        const isManager = req.session.user.id === req.session.team.team_manager
        if (!isManager) {
            return res.status(401).send('Only the manager can make team events')
        }
        const teamId = req.session.team.id;
        const name = req.body.name || null;
        const description = req.body.description || null;
        const addressLineOne = req.body.addressLineOne || null;
        const addressLineTwo = req.body.addressLineTwo || null;
        const addressLineThree = req.body.addressLineThree || null;
        const city = req.body.city || null;
        const state = req.body.state || null;
        const zipCode = req.body.zipCode || null;
        const {mandetory, date, time} = req.body;
        const db = req.app.get('db')
        await db.create_event([teamId, name, description, addressLineOne, addressLineTwo, addressLineThree, city, state, zipCode, mandetory, date, time]).catch(error => {
            console.log(error)
            res.sendStatus(500)
        })
        req.session.team.events = await db.get_team_events([teamId])
        res.status(200).send(req.session.team)
    },

    getEvents: async (req, res) => {
        const {user} = req.session
        if (!user) {
            return res.status(401).send('must be logged in to view events')
        }
        const db = req.app.get('db')
        const events = await db.get_events([user.id])
        req.session.user.events = events
        res.status(200).send(req.session.user)
    },

    editEvent: async (req, res) => {
        const {user} = req.session
        if (!user) {
            return res.status(401).send('must be logged in to edit events')
        }
        const db = req.app.get('db')
        const name = req.body.name || null;
        const description = req.body.description || null;
        const addressLineOne = req.body.addressLineOne || null;
        const addressLineTwo = req.body.addressLineTwo || null;
        const addressLineThree = req.body.addressLineThree || null;
        const city = req.body.city || null;
        const state = req.body.state || null;
        const zipCode = req.body.zipCode || null;
        const {mandetory, date, time, id, teamId} = req.body;
        const team = await db.get_team([teamId])
        const teamManager = team[0].team_manager
        const isManager = user.id === teamManager
        if (!isManager) {
            return res.status(401).send('Only the manager can edit team events')
        }
        await db.edit_event([id, name, description, addressLineOne, addressLineTwo, addressLineThree, city, state, zipCode, mandetory, date, time]).catch(error => {
            console.log(error)
            res.sendStatus(500)
        })
        const events = await db.get_events([user.id])
        req.session.user.events = events
        res.status(200).send(req.session.user)
    },

    deleteEvent: async (req, res) => {
        const {user} = req.session
        if (!user) {
            return res.status(401).send('must be logged in to edit events')
        }
        const {teamId, id} = req.body
        const team = await db.get_team([teamId])
        const teamManager = team[0].team_manager
        const isManager = user.id === teamManager
        if (!isManager) {
            return res.status(401).send('Only the manager can delete team events')
        }
        await db.delete_event([id])
        const events = await db.get_events([user.id])
        req.session.user.events = events
        res.status(200).send(req.session.user)
    }
}