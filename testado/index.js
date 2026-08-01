require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const API = `https://api.telegram.org/bot${TOKEN}`;

app.get("/", (req, res) => {
    res.json({
        status: "online",
        bot: "@Mg_mega_bot"
    });
});

app.get("/me", async (req, res) => {
    try {
        const r = await axios.get(`${API}/getMe`);
        res.json(r.data);
    } catch (e) {
        res.status(500).json({
            erro: e.message
        });
    }
});

app.post("/send", async (req, res) => {
    try {
        const { chat_id, text } = req.body;

        const r = await axios.post(`${API}/sendMessage`, {
            chat_id,
            text
        });

        res.json(r.data);
    } catch (e) {
        res.status(500).json({
            erro: e.response?.data || e.message
        });
    }
});

app.get("/updates", async (req, res) => {
    try {
        const r = await axios.get(`${API}/getUpdates`);
        res.json(r.data);
    } catch (e) {
        res.status(500).json({
            erro: e.message
        });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("API iniciada.");
});