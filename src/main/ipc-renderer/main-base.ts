import { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent, ipcMain } from 'electron';

import {
  BaseEvent,
  BaseInvokeEvent,
  EventAnyResponse,
  EventData,
  EventHandler,
  EventType,
  InvokeListener,
  IpcMainBase,
  UnsubscribeFn,
} from './types';

export function getIpcMainBase<
  TToRenderer extends BaseEvent,
  TFromRenderer extends BaseEvent,
  TInvokeFromRendererData extends BaseInvokeEvent,
>(channel: string): IpcMainBase<TToRenderer, TFromRenderer, TInvokeFromRendererData> {
  let mainBrowserWindow: BrowserWindow | undefined;

  const invokeEventHandlers = new Map<
    string,
    (data: EventAnyResponse<TInvokeFromRendererData>) => Promise<EventAnyResponse<TInvokeFromRendererData>>
  >();
  const invokeHandler = (
    _event: IpcMainInvokeEvent,
    data: TInvokeFromRendererData,
  ): Promise<EventAnyResponse<TInvokeFromRendererData>> => {
    const eventType = data.type;
    const handler = invokeEventHandlers.get(eventType);
    if (!handler) {
      throw new Error(`handler for {eventType} not found`);
    }

    return handler(data.data);
  };

  return {
    initialize(mainWindow: BrowserWindow): void {
      mainBrowserWindow = mainWindow;
      ipcMain.handle(channel, invokeHandler);
    },

    destroy(): void {
      ipcMain.removeHandler(channel);
    },

    on<Type extends EventType<TFromRenderer>>(
      eventType: Type,
      func: EventHandler<EventData<TFromRenderer, Type>>,
    ): UnsubscribeFn {
      const subscription = (_event: IpcMainEvent, data: TFromRenderer): void => {
        if (data.type === eventType) {
          func(data.data);
        }
      };
      ipcMain.on(channel, subscription);

      return () => {
        ipcMain.removeListener(channel, subscription);
      };
    },

    once<Type extends EventType<TFromRenderer>>(
      eventType: Type,
      func: EventHandler<EventData<TFromRenderer, Type>>,
    ): void {
      const subscription = (_event: IpcMainEvent, data: TFromRenderer): void => {
        if (data.type === eventType) {
          func(data.data);
        }
      };
      ipcMain.once(channel, subscription);
    },

    sendMessage(data: TToRenderer): void {
      if (!mainBrowserWindow) {
        return;
      }

      mainBrowserWindow.webContents.send(channel, data);
    },

    handle<Type extends EventType<TInvokeFromRendererData>>(
      eventType: Type,
      handler: InvokeListener<TInvokeFromRendererData, Type>,
    ): void {
      invokeEventHandlers.set(eventType, handler as any);
    },
  };
}
