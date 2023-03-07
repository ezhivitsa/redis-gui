import { IpcMainEvent, ipcMain } from 'electron';

import { UnsubscribeFn } from './types';

export abstract class IpcMainBase<TInput, TOutput> {
  protected abstract channel: string;

  initialize(): UnsubscribeFn {
    ipcMain.on(this.channel, this.handleEvents);

    return () => {
      this.destroy();
    };
  }

  destroy(): void {
    ipcMain.removeListener(this.channel, this.handleEvents);
  }

  sendData(data: TOutput): void {
    ipcMain.emit(this.channel, data);
  }

  protected abstract handleEvents: (event: IpcMainEvent, data: TInput) => void;
}
