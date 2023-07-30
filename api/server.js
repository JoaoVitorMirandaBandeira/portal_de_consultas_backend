const valorLiquido = require("../src/conect-tbc/valorLiquido")
const buscarConsulta = require("../src/conect-tbc/buscarConsulta")
const express = require("express")

const app = express();
app.use(express.json());

app.get("/valorLiquido", async (req, res) => {
    try{
        const { url, user, passWord, idlan, codcoligada } = req.body;
        const response = await valorLiquido(url, user, passWord, idlan, codcoligada);
        return res.status(200).json(response);
    }catch(erro){
        return res.status(500).json(erro)
    }
});
app.get("/consulta", async (req, res) => {
    try {
        const { url, user, passWord,codcoligada,codSistema,codSentenca,codFilial } = req.body;
        const response = await buscarConsulta(url, user, passWord, codcoligada,codSistema,codSentenca,codFilial);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json(erro)
    }
})

app.listen(3000, () => {
    console.log("Servidor iniciado na porta 3000");
});