const {contextBridge, ipcMain, ipcRenderer} = require('electron');

let exposed = {
    exceptionReceived : (callback) => ipcRenderer.on('exception-event', (callback))
}

contextBridge.exposeInMainWorld("ExceptionBridge", exposed)
