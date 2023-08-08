const { DataTypes } = require('sequelize')
const Sequelize = require('../config/sequelize')

const User = Sequelize.define('users', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
})

User.associate = (models) => {
    User.hasMany(models.tbc, { foreignKey: 'userId' });
};

module.exports = User