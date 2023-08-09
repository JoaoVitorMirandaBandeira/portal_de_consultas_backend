const { JsonWebTokenError, sign } = require("jsonwebtoken")
const dotenv = require("dotenv");
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET

const createToken = (user) => {
    return sign({ email: user.email, name: user.name }, SECRET_KEY)
}

module.exports = createToken