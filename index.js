
const express = require('express');
const { Client } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const sessions = new Map();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/create-session', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    const client = new Client({
      auth: {
        creds: {},
        keys: {}
      },
      printQRInTerminal: false
    });

    const sessionId = `session_${Date.now()}`;
    sessions.set(sessionId, client);

    client.ev.on('connection.update', async (update) => {
      const { qr, connection } = update;
      
      if (qr) {
        const qrCode = await qrcode.toDataURL(qr);
        io.to(sessionId).emit('qr', qrCode);
      }

      if (connection === 'open') {
        const authInfo = client.authState;
        fs.writeFileSync(
          `./sessions/${sessionId}.json`,
          JSON.stringify(authInfo)
        );
        io.to(sessionId).emit('connected', { sessionId });
      }
    });

    await client.connect();
    res.json({ sessionId });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

app.get('/session-status/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const client = sessions.get(sessionId);
  
  if (!client) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json({ 
    status: client.connected ? 'connected' : 'pending',
    sessionId 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
