module.exports = {
    getUser: (req, res) => {
        if (req.session.user) {
            res.status(200).send(req.session.user)
        } else {
            res.status(401).send('Please login first')
        }
    },
    editProfile: async (req, res) => {
        if (!req.session.user) {
            return res.status(401).send('Please login first');
        }
        console.log(req.body)
        const { id } = req.session.user
        const email = req.body.email;
        const full_name = req.body.full_name || null;
        const rawPhone = req.body.phone || null;
        let phone
        if (!rawPhone) {
            phone = null;
        } else {
            phone = Number(JSON.stringify(rawPhone).match(/\d/g).join('')) || null;
        }
        const preferred_contact_method = req.body.preferred_contact_method || null;
        const profile_picture_url = req.body.profile_picture_url || null;
        const displayed_name = req.body.displayed_name || null
        if (!email) {
            return res.status(401).send('Must have an email')
        }
        const db = req.app.get('db');
        const existingUserEmail = await db.find_user([email])
        if ((existingUserEmail[0] && existingUserEmail[0].id == id) || !existingUserEmail[0]) {
            const db = req.app.get('db');
            const user = await db.edit_profile([id, email, full_name, phone, preferred_contact_method, profile_picture_url, displayed_name])
            req.session.user = user[0]
            res.status(200).send(req.session.user);
        } else {
            res.status(401).send('Sorry, that email is already in use by another user')
        }
    },
}