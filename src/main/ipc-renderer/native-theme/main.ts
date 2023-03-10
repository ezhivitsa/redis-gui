import { BrowserWindow, nativeTheme } from 'electron';

import { getIpcMainBase } from '../main-base';
import { Channel, IpcMainBase } from '../types';

import { NativeThemeData, NativeThemeInvokeData, NativeThemeToRendererData } from './types';

const ipcMainBase = getIpcMainBase<NativeThemeToRendererData, never, NativeThemeInvokeData>(Channel.NATIVE_THEME);

function sendDataToHost(): void {
  ipcMainBase.sendMessage({
    type: 'NATIVE_THEME_UPDATED',
    data: {
      shouldUseDarkColors: nativeTheme.shouldUseDarkColors,
    },
  });
}

export const nativeThemeMain: IpcMainBase<NativeThemeToRendererData, never, NativeThemeInvokeData> = {
  ...ipcMainBase,

  initialize(mainWindow: BrowserWindow): void {
    ipcMainBase.initialize(mainWindow);
    ipcMainBase.handle('GET_NATIVE_THEME', async (): Promise<NativeThemeData> => {
      return {
        shouldUseDarkColors: nativeTheme.shouldUseDarkColors,
      };
    });
    nativeTheme.on('updated', sendDataToHost);
  },

  destroy() {
    nativeTheme.removeListener('updated', sendDataToHost);
    ipcMainBase.destroy();
  },
};
