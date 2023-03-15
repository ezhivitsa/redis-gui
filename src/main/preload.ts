import { menuRenderer, nativeThemeRenderer, redisRenderer } from './ipc-renderer/renderer';
import { contextBridge } from 'electron';

const electronHandler = {
  nativeTheme: nativeThemeRenderer,
  menu: menuRenderer,
  redis: redisRenderer,
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
