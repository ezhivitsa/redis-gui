import { nativeThemeRenderer } from './ipc-renderer/renderer';
import { contextBridge } from 'electron';

const electronHandler = {
  nativeTheme: nativeThemeRenderer,
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
