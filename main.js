const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // Prevents renderer from accessing Node.js APIs directly
      enableRemoteModule: false, // Security best practice
      // nodeIntegration: true,
    },
  });

  mainWindow.loadURL('http://localhost:4200');
});

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// Listen for messages from the renderer process
ipcMain.on('toMain', (event, args) => {
  console.log('Message received from Angular:', args);

  // Send a response back to the renderer process
  mainWindow.webContents.send('fromMain', 'Message received on Electron side!');
});
