const express = require('express');
const app = express();
const keyDatabase = new Map();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.get('/', (req, res) => {
    const hwid = req.query.hwid || "Unknown";
    const newKey = "TLONG-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    keyDatabase.set(newKey, { hwid: hwid, expires: Date.now() + 86400000 });

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>TLONG HUB | KEY SYSTEM</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body { background: #0f0f0f; color: #fff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; overflow: hidden; }
                .container { background: rgba(25, 25, 25, 0.95); padding: 30px; border-radius: 20px; border: 1px solid #00ccff; box-shadow: 0 0 20px rgba(0, 204, 255, 0.2); text-align: center; max-width: 90%; width: 400px; }
                h1 { color: #00ccff; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; font-size: 24px; }
                .hwid-text { color: #888; font-size: 12px; margin-bottom: 20px; word-break: break-all; }
                .key-box { background: #000; border: 2px dashed #00ccff; padding: 15px; font-size: 28px; font-weight: bold; color: #fff; margin: 20px 0; border-radius: 10px; text-shadow: 0 0 10px #00ccff; }
                button { background: #00ccff; color: #000; border: none; padding: 12px 25px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s; font-size: 16px; width: 100%; }
                button:hover { background: #fff; transform: scale(1.05); box-shadow: 0 0 15px #00ccff; }
                .footer { margin-top: 20px; font-size: 11px; color: #555; }
                .glow { animation: neon 1.5s ease-in-out infinite alternate; }
                @keyframes neon { from { text-shadow: 0 0 5px #00ccff, 0 0 10px #00ccff; } to { text-shadow: 0 0 10px #00ccff, 0 0 20px #00ccff, 0 0 30px #00ccff; } }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="glow">TLONG HUB</h1>
                <div class="hwid-text">Device ID: ${hwid}</div>
                <div style="color: #0f0;">Vượt Link Thành Công!</div>
                <div class="key-box" id="keyText">${newKey}</div>
                <button onclick="copyKey()">COPY KEY</button>
                <div class="footer">Key hết hạn sau 24 giờ. Vui lòng không chia sẻ Key!</div>
            </div>
            <script>
                function copyKey() {
                    const text = document.getElementById('keyText').innerText;
                    navigator.clipboard.writeText(text);
                    const btn = document.querySelector('button');
                    btn.innerText = 'ĐÃ COPY!';
                    btn.style.background = '#0f0';
                    setTimeout(() => {
                        btn.innerText = 'COPY KEY';
                        btn.style.background = '#00ccff';
                    }, 2000);
                }
            </script>
        </body>
        </html>
    `);
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
