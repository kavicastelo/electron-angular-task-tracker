import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Remote = Electron.Remote;
import * as Electron from 'electron';

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
  imports: [RouterOutlet],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'task-tracker';

  messageFromElectron: string = '';

  sendMessage() {
    // Send a message to the main process
    window.electron?.sendToMain('toMain', 'Hello from Angular!');

    // Listen for a response from the main process
    window.electron?.onFromMain('fromMain', (response: string) => {
      this.messageFromElectron = response;
    });
  }
}
