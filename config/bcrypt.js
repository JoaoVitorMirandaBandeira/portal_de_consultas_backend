const bcrypt = require('bcrypt');

const criptografarSenha = async (senha) => {
    const saltRouds = 10;

    const salt = await bcrypt.genSalt(saltRouds);

    const senhaCriptografada = await bcrypt.hash(senha, salt);

    return senhaCriptografada
}

module.exports = criptografarSenha