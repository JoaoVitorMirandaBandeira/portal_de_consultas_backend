const valorLiquido = require("../src/conect-tbc/valorLiquido")
const buscarConsulta = require("../src/conect-tbc/buscarConsulta")
const express = require("express");
const salvarConsulta = require("../src/conect-tbc/salvarConsulta");
const UserRouter = require('../src/router/user')

const app = express();
app.use(express.json());
app.use(UserRouter)
app.get("/valorLiquido", async (req, res) => {
    try {
        const { url, user, passWord, idlan, codcoligada } = req.body;
        const response = await valorLiquido(url, user, passWord, idlan, codcoligada);
        return res.status(200).json(response);
    } catch (erro) {
        return res.status(500).json(erro)
    }
});
app.get("/consulta", async (req, res) => {
    try {
        const { url, user, passWord, codColigada, codSistema, codSentenca } = req.body;
        const response = await buscarConsulta(url, user, passWord, codColigada, codSistema, codSentenca);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json(`Internal server error: ${error}`)
    }
})

app.post("/consulta", async (req, res) => {
    try {
        const { url, user, passWord, codColigada, codSistema, codSentenca, titleSentenca, conteudoSentenca } = req.body
        const response = await salvarConsulta(url, user, passWord, codColigada, codSistema, codSentenca, titleSentenca, conteudoSentenca)
        return res.status(201).json(response)
    } catch (error) {
        return res.status(500).json(`Internal server error: ${error}`)
    }
})

app.listen(3000, () => {
    console.log("Servidor iniciado na porta 3000");
});