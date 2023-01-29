const { app, BrowserWindow, ipcMain } = require('electron')
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 1030 });
const path = require('path');

const createWindow = () => {
  const winOne = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:{
        preload: path.join(__dirname, './views/logs/preload.js')
    }
  });
  // const winTwo = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  //   webPreferences:{
  //       preload: path.join(__dirname, './views/exceptions/preload.js')
  //   }
  // });

  // winOne.webContents.openDevTools();

  wss.on('connection', (ws) => {
    ws.on('message', (event) => {
        const message = event.toString('ascii');
        winOne.webContents.send('log-event', message);
        winOne.show();

        // if(data.type === 'exception') {
        //   winTwo.webContents.send('exception-event', message);
        //   winTwo.show();
        // }
        
    });
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  winOne.loadFile('views/logs/index.html')
  // winTwo.loadFile('views/exceptions/index.html')
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
    app.quit();
})
