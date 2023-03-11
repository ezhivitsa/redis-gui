import { menuRenderer, nativeThemeRenderer } from './ipc-renderer/renderer';
import { contextBridge } from 'electron';

const electronHandler = {
  nativeTheme: nativeThemeRenderer,
  menu: menuRenderer,
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
