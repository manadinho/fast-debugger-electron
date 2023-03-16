const {contextBridge, ipcMain, ipcRenderer} = require('electron');

var SearchDialog = require('electron-search-dialog').default;
 
// create instance.
var mainWindow = require('electron').remote.getCurrentWindow();
var sd = new SearchDialog(mainWindow);
 
// open search dialog
sd.openDialog();

let exposed = {
    logReceived : (callback) => ipcRenderer.on('log-event', (callback)),
    getSettings : (callback) => ipcRenderer.on('settings', (callback)),
    updateSettings: (settings) => ipcRenderer.send('settings-update', settings)
}

contextBridge.exposeInMainWorld("Bridge", exposed)
