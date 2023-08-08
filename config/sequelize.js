//Instanciando o Sequelize
const Sequelize = require("sequelize")
//Puxar as cunfigurações do arquivo config.js
const databese = require("./config")
//Criar um objeto sequelize com as configs do banco
const sequelize = new Sequelize(database)
//Exportar as configuraçoes da conecção com o banco
module.exports = sequelize