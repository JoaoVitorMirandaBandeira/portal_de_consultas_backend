const valorLiquido = require("../valorLiquido")
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

app.listen(3000, () => {
    console.log("Servidor iniciado na porta 3000");
});