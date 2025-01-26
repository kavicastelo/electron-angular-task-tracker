import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Remote = Electron.Remote;
import * as Electron from 'electron';
import {FormsModule} from '@angular/forms';

interface ExtendedRemote extends Remote {
  sendToMain(channel: string, ...args: any[]): void;
  onFromMain(channel: string, listener: (...args: any[]) => void): void;
}

declare global {
  interface Window {
    electron: ExtendedRemote;
  }
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'task-tracker';

  messageFromElectron: string = '';

  selectedFileContent: string = '';
  filePath: string = '';

  newFilePath: string = 'newFile.txt';

  ngOnInit() {
    // Listen for new file creation response
    window.electron?.onFromMain('new-file-created', (filePath: string) => {
      this.filePath = filePath;
      this.selectedFileContent = ''; // Reset content for the new file
      console.log('New file path received:', filePath);
    });
  }

  sendMessage() {
    // Send a message to the main process
    window.electron?.sendToMain('toMain', 'Hello from Angular!');

    // Listen for a response from the main process
    window.electron?.onFromMain('fromMain', (response: string) => {
      this.messageFromElectron = response;
    });
  }

  openFile() {
    // Request the main process to open a file dialog
    window.electron?.sendToMain('open-file');

    // Listen for the selected file content and path
    window.electron?.onFromMain('file-opened', (fileContent: string, filePath: string) => {
      this.selectedFileContent = fileContent;
      this.filePath = filePath;
    });
  }

  saveFile() {
    if (!this.filePath) {
      alert('No file opened to save!');
      return;
    }
    const validExtensions = ['.txt', '.json', '.md'];
    const fileExtension = this.filePath.slice(this.filePath.lastIndexOf('.'));
    if (!validExtensions.includes(fileExtension)) {
      alert(`Invalid file format! Allowed formats: ${validExtensions.join(', ')}`);
      return;
    }
    window.electron?.sendToMain('save-file', {
      content: this.selectedFileContent,
      path: this.filePath
    });
  }

  createNewFile() {
    if (!this.newFilePath) {
      alert('File creation canceled.');
      return;
    }

    // Validate file name and extension
    const validExtensions = ['.txt', '.json'];
    const fileExtension = this.newFilePath.slice(this.newFilePath.lastIndexOf('.'));
    if (!validExtensions.includes(fileExtension)) {
      alert(`Invalid file format! Allowed formats: ${validExtensions.join(', ')}`);
      return;
    }

    window.electron?.sendToMain('create-new-file', this.newFilePath);
  }
}
