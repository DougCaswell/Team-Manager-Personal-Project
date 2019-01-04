module.exports = {
    newTeam: async (req, res) => {
        if (!req.session.user) {
            return res.status(401).send('Must login first')
        }
        const { name, description, id } = req.body;
        const db = req.app.get('db');
        const team = await db.create_team([name, description, id]);
        req.session.team = team[0]
        await db.add_user_to_team([id, team[0].id])
        res.status(201).send(req.session.team)
    },
    getMyTeam: async (req, res) => {
        if (!req.session.user) {
            return res.status(401).send('Must login first')
        }
        const { teamid } = req.params
        const db = req.app.get('db')
        const userOnTeam = await db.find_user_on_team([teamid, req.session.user.id])
        if (!userOnTeam[0]) {
            return res.status(401).send('Must be on team to view details')
        }
        const members = await db.get_team_members([teamid])
        const team = await db.get_team([teamid])
        req.session.team = team[0]
        req.session.team.members = members
        res.status(200).send(req.session.team)
    },
    addMember: async (req, res) => {
        const { email, teamId } = req.body
        const db = req.app.get('db')
        const isManager = req.session.user.id === req.session.team.team_manager
        if (!isManager) {
            return res.status(401).send('Only the manager can update the team')
        }
        const user = await db.find_user([email])
        if (!user[0]) {
            return res.status(200).send('Sorry, no user with that email exists.  They must create an account first.')
        }
        const onTeamAlready = await db.find_user_on_team([teamId, user[0].id])
        if (onTeamAlready[0]) {
            return res.status(200).send('User is already on this team')
        }
        await db.add_user_to_team([user[0].id, teamId])
        const members = await db.get_team_members([teamId])
        const team = await db.get_team([teamId])
        req.session.team = team[0]
        req.session.team.members = members
        res.status(200).send(req.session.team)
    },
    getTeams: async (req, res) => {
        const { id, email } = req.body
        const db = req.app.get('db')
        const found = await db.find_user([email])
        if (!found[0]) {
            return res.status(401).send('please log in first')
        }
        const teams = await db.get_teams([id])
        req.session.user.teams = teams
        res.status(200).send(req.session.user.teams)
    },
    editTeamDescription: async (req, res) => {
        const db = req.app.get('db')
        const { teamId, description } = req.body
        const isManager = req.session.user.id === req.session.team.team_manager
        if (!isManager) {
            return res.status(401).send('Only the manager can update the team')
        }
        const team = await db.edit_team_description([teamId, description])
        req.session.team = team[0]
        res.status(200).send(req.session.team)
    },
    editTeamName: async (req, res) => {
        const db = req.app.get('db')
        const { teamId, name } = req.body
        const isManager = req.session.user.id === req.session.team.team_manager
        if (!isManager) {
            return res.status(401).send('Only the manager can update the team')
        }
        const team = await db.edit_team_name([teamId, name])
        req.session.team = team[0]
        res.status(200).send(req.session.team)
    },
    editTeamManager: async (req, res) => {
        const db = req.app.get('db')
        const { teamId, manager } = req.body
        const isManager = req.session.user.id === req.session.team.team_manager
        if (!isManager) {
            return res.status(401).send('Only the manager can update the team')
        }
        const newManager = await db.find_user([manager])
        if (!newManager[0]) {
            return res.status(401).send('Invalid email')
        }
        const managerArr = await db.find_user_on_team([teamId, newManager[0].id])
        if (!managerArr[0]) {
            return res.status(401).send('New manager must already be on team')
        }
        const team = await db.edit_team_manager([teamId, managerArr[0].id])
        req.session.team = team[0]
        res.status(200).send(req.session.team)
    },
    removeMember: async (req, res) => {
        const { teamId, id } = req.body
        const db = req.app.get('db')
        const isManager = req.session.user.id === req.session.team.team_manager
        if (!isManager) {
            return res.status(401).send('Only the manager can update the team')
        }
        if (id === req.session.user.id) {
            return res.status(403).send("Sorry, the manager can't remove themselves from the team.  You can make someone else the manager and leave the team or delete the team.")
        }
        await db.remove_member([id, teamId])
        const members = await db.get_team_members([teamId])
        const team = await db.get_team([teamId])
        req.session.team = team
        req.session.team.members = members
        res.status(200).send(req.session.team)
    },
    deleteTeam: async (req, res) => {
        const { teamId } = req.body
        const db = req.app.get('db')
        const isManager = req.session.user.id === req.session.team.team_manager
        if (!isManager) {
            return res.status(401).send('Only the manager can update the team')
        }
        await db.delete_team([teamId])
        req.session.team = {}
        res.status(200).send(req.session.team)
    },
    leaveTeam: async (req, res) => {
        const { teamId, id } = req.body
        const db = req.app.get('db')
        const isManager = req.session.user.id === req.session.team.team_manager
        if (isManager) {
            return res.status(403).send("Managers can't leave teams.  Unless they make someone else the manager or delete the team.")
        }
        await db.remove_member([id, teamId])
        const members = await db.get_team_members([teamId])
        const team = await db.get_team([teamId])
        req.session.team = team
        req.session.team.members = members
        res.status(200).send(req.session.team)
    }
}