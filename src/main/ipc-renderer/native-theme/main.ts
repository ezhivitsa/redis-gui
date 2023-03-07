import { IpcMainEvent, nativeTheme } from 'electron';

import { IpcMainBase } from '../main-base';
import { Channel, UnsubscribeFn } from '../types';

import { NativeThemeInputData, NativeThemeOutputData } from './types';

export class NativeThemeMain extends IpcMainBase<NativeThemeInputData, NativeThemeOutputData> {
  protected channel = Channel.NATIVE_THEME;

  initialize(): UnsubscribeFn {
    nativeTheme.on('updated', this.sendDataToHost);

    return super.initialize();
  }

  destroy(): void {
    super.destroy();

    nativeTheme.removeListener('updated', this.sendDataToHost);
  }

  protected handleEvents = (_event: IpcMainEvent, data: NativeThemeInputData): void => {
    switch (data.type) {
      case 'DATA_REQUEST':
        this.sendDataToHost();
    }
  };

  private sendDataToHost = (): void => {
    this.sendData({
      type: 'NATIVE_THEME_UPDATED',
      data: {
        shouldUseDarkColors: nativeTheme.shouldUseDarkColors,
      },
    });
  };
}
