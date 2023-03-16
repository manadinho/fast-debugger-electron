const { app, BrowserWindow, ipcMain } = require('electron');
const Store = require('electron-store');
const WebSocket = require('ws');
const path = require('path');

const store = new Store({
  name: 'fast-debugger'
});

let mainWindow;
let SETTINGS = store.get('SETTINGS') || { PORT: 23518, EDITOR: 'VSCODE' };

const createSocketServer = () => {
  const wss = new WebSocket.Server({ port: SETTINGS.PORT });

  wss.on('connection', (ws) => {
    ws.on('message', (event) => {
        const message = event.toString('ascii');
        mainWindow.webContents.send('log-event', message);
        mainWindow.show();
        
    });
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

}

const createWindow = () => {
    createSocketServer();
    mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: __dirname + '/images/logo.icns',
    webPreferences:{
        preload: path.join(__dirname, './views/logs/preload.js')
    }
  });

  // open devtools
  mainWindow.webContents.openDevTools();

  // SEND SETTINGS TO VIEW
  setTimeout(() => {
    mainWindow.webContents.send('settings', SETTINGS);
  }, 1000);

  mainWindow.loadFile('views/logs/index.html')
}

app.whenReady().then(() => {
  createWindow();
})

ipcMain.on('settings-update', (event, data) => {
  SETTINGS = {...data};
  store.set('SETTINGS', SETTINGS);
  app.relaunch()
app.exit()
})

app.on('window-all-closed', () => {
  app.quit()
})
