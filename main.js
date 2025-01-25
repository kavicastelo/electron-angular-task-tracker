const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

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

// Handle 'open-file' request
ipcMain.on('open-file', async (event) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Text Files', extensions: ['txt', 'md', 'json'] }],
  });

  if (!canceled && filePaths.length > 0) {
    const filePath = filePaths[0];
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    event.sender.send('file-opened', fileContent, filePath);
  }
});

// Handle 'save-file' request
ipcMain.on('save-file', (event, data) => {
  if (typeof data.content === 'undefined') {
    console.error('fileContent is undefined');
    return;
  }
  fs.writeFileSync(data.path, data.content, 'utf-8');
});
