const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./user'); // Import User model

const TBC = sequelize.define('TBC', {
    description: DataTypes.STRING,
    tbc: DataTypes.STRING,
    codColigada: DataTypes.STRING,
    codFilial: DataTypes.STRING,
    codSistema: DataTypes.STRING,
    userId: DataTypes.INTEGER
});

TBC.associate = (models) => {
    TBC.belongsTo(models.user, { foreignKey: 'userId' });
};

module.exports = TBC;
