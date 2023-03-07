import { NativeThemeRenderer } from './ipc-renderer/renderer';
import { contextBridge } from 'electron';

const electronHandler = {
  nativeTheme: new NativeThemeRenderer(),
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
