const {contextBridge, ipcMain, ipcRenderer} = require('electron');

let exposed = {
    logReceived : (callback) => ipcRenderer.on('log-event', (callback))
}

contextBridge.exposeInMainWorld("Bridge", exposed)
