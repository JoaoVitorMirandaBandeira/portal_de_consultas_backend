const User = require('../../models/user')

module.exports = {
    async store(req, res) {
        const { name, email, password } = req.body
        try {
            const user = await User.create({ name, email, password })
            return res.status(201).json(user)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    async get(req, res) {
        const { email, password } = req.body
        try {
            const user = await User.findOne({
                where: {
                    email: email
                }
            })
            if (!user) throw new Error(`User ${email} not found`)
            if (user.password !== password) throw new Error(`Password is incorrect`)
            return res.status(200).json(user)
        } catch (e) {
            return res.status(500).json({ error: e })
        }
    }
}