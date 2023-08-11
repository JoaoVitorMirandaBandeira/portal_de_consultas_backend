const User = require('../../models/user')
const criptografarSenhaUser = require('../../config/bcrypt')
const createToken = require('../functions/createToken')
const bcrypt = require('bcrypt');

module.exports = {
    async store(req, res) {
        const { name, email, password} = req.body
        try {
            const user = await User.findOne({
                where: {
                    email: email
                }
            })
            if (user) throw new Error(`Usuario ja existente`)
            let passwordCriptografada = await criptografarSenhaUser(password)
            const newUser = await User.create({ name, email, password: passwordCriptografada, status: false, permissions: 1})
            newUser.password = undefined
            return res.status(201).json({ user, token })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    async get(req, res) {
        const { email, password} = req.body
        try {
            const user = await User.findOne({
                where: {
                    email: email
                }
            })
            if (!user) throw new Error(`User ${email} não existe`)
            const passwordMatch = await bcrypt.compare(password, user.password)
            if (!passwordMatch) throw new Error(`Password is incorrect`)
            const token = createToken(user)
            user.password = undefined
            return res.status(200).json({ user, token })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}