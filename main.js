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
ipcMain.on('save-file', async (event, data) => {
  const { path, content } = data;
  if (typeof content === 'undefined') {
    console.error('fileContent is undefined');
    return;
  }
  // Show confirmation dialog
  const response = await dialog.showMessageBox({
    type: 'question',
    buttons: ['Yes', 'No'],
    defaultId: 0,
    title: 'Confirm Save',
    message: `Are you sure you want to save changes to ${path}?`,
  });

  if (response.response === 0) { // User clicked 'Yes'
    try {
      fs.writeFileSync(path, content, 'utf-8');
      console.log('File saved successfully:', path);
    } catch (err) {
      console.error('Error saving file:', err);
    }
  } else {
    console.log('Save canceled by user.');
  }
});

// Handle 'create-new-file' request
ipcMain.on('create-new-file', async (event, fileName) => {
  // Open a dialog to let the user choose where to save the new file
  const { filePath } = await dialog.showSaveDialog({
    title: 'Create New File',
    defaultPath: path.join(__dirname, fileName),
    buttonLabel: 'Create File',
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'JSON Files', extensions: ['json'] },
    ],
  });

  if (filePath) {
    if (fs.existsSync(filePath)) {
      const { response } = await dialog.showMessageBox({
        type: 'warning',
        buttons: ['Yes', 'No'],
        defaultId: 1,
        title: 'Overwrite File',
        message: `The file "${filePath}" already exists. Do you want to overwrite it?`,
      });

      if (response === 1) {
        console.log('File overwrite canceled.');
        return;
      }
    }

    try {
      fs.writeFileSync(filePath, '', 'utf-8'); // Create an empty file
      console.log('New file created:', filePath);

      // Inform the renderer process about the new file path
      event.reply('new-file-created', filePath);
    } catch (err) {
      console.error('Error creating file:', err);
      event.reply('new-file-created', null);
    }
  } else {
    console.log('File creation canceled.');
    event.reply('new-file-created', null);
  }
});

ipcMain.on('open-file', async (event, filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    console.log('✅ File opened:', filePath);
    event.reply('file-opened', filePath, fileContent);
  } catch (err) {
    console.error('❌ Error opening file:', err);
  }
});
