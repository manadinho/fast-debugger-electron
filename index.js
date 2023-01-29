const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 1031 });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        message = message.toString('ascii')
        // Broadcast the message to every connected client
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
