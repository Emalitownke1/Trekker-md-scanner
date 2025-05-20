const express = require('express');
const { makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <form action="/pair" method="POST">
      <label>Enter your phone number:</label><br>
      <input type="text" name="phone" required />
      <button type="submit">Pair WhatsApp</button>
    </form>
  `);
});

app.post('/pair', async (req, res) => {
  const phone = req.body.phone;
  const sessionFile = `./auth-${phone}.json`;
  const { state, saveState } = useSingleFileAuthState(sessionFile);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, qr } = update;
    if (qr) {
      console.log('Scan this QR code:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'open') {
      console.log('Connection successful');
      res.send(`Session for ${phone} is ready. Session file: ${sessionFile}`);
    }

    if (connection === 'close') {
      console.log('Connection closed');
    }
  });

  sock.ev.on('creds.update', saveState);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
