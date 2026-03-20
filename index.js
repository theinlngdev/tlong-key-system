const express = require('express');
const app = express();
const keyDatabase = new Map();

app.get('/', (req, res) => {
    const hwid = req.query.hwid;
    if (!hwid) return res.send("Thieu HWID!");
    const newKey = "TLONG-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    keyDatabase.set(newKey, { hwid: hwid, expires: Date.now() + 86400000 });
    res.send(`<h1>Key: ${newKey}</h1><p>HWID: ${hwid}</p>`);
});

app.get('/verify', (req, res) => {
    const { key, hwid } = req.query;
    const data = keyDatabase.get(key);
    if (data && data.hwid === hwid && Date.now() < data.expires) {
        res.send("true");
    } else {
        res.send("false");
    }
});

module.exports = app;
