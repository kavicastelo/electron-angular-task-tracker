const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    sendToMain: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    onFromMain: (channel, callback) => {
        ipcRenderer.on(channel, (event, ...args) => callback(...args));
    },
});
