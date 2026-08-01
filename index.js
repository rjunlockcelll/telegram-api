require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;

if (!TOKEN) {
    console.log("BOT_TOKEN não encontrado no arquivo .env");
    process.exit(1);
}

const API = `https://api.telegram.org/bot${TOKEN}`;

// ROTA PRINCIPAL — responde exatamente o que o sistema espera
app.get("/", (req, res) => {
    res.status(200).json({
        message: "SN register Successfully!",
        status: "online",
        bot: "@Mg_mega_bot"
    });
});

app.get("/me", async (req, res) => {
    try {
        const resposta = await axios.get(`${API}/getMe`);
        res.json(resposta.data);
    } catch (erro) {
        res.status(500).json(erro.response?.data || {
            ok: false,
            erro: erro.message
        });
    }
});

app.get("/updates", async (req, res) => {
    try {
        const resposta = await axios.get(`${API}/getUpdates`);
        res.json(resposta.data);
    } catch (erro) {
        res.status(500).json(erro.response?.data || {
            ok: false,
            erro: erro.message
        });
    }
});

app.post("/send", async (req, res) => {
    const { chat_id, text } = req.body;

    if (!chat_id || !text) {
        return res.status(400).json({
            ok: false,
            description: "chat_id e text são obrigatórios."
        });
    }

    try {
        const resposta = await axios.post(`${API}/sendMessage`, {
            chat_id,
            text
        });
        return res.status(200).json(resposta.data);
    } catch (erro) {
        return res.status(500).json(
            erro.response?.data || {
                ok: false,
                description: erro.message
            }
        );
    }
});

// Resposta para qualquer caminho que não existir
app.use((req, res) => {
    res.status(404).json({
        ok: false,
        message: "Not Found!"
    });
});

// Configuração para o Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`API Online`);
    console.log(`Rodando na porta ${PORT}`);
});