const { verify } = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET

const readToken = (token) => {
    try {
        return verify(token, SECRET_KEY);
    } catch (error) {
        return new Error('Token not valid')
    }
}

module.exports = readToken