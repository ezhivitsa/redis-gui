import { IpcRendererEvent, ipcRenderer } from 'electron';

import {
  BaseEvent,
  BaseInvokeEvent,
  EventData,
  EventHandler,
  EventResponse,
  EventType,
  IpcRendererBase,
  UnsubscribeFn,
} from './types';

export function getBaseIpcRenderer<
  TToRenderer extends BaseEvent,
  TFromRenderer extends BaseEvent,
  TInvokeFromRendererData extends BaseInvokeEvent,
>(channel: string): IpcRendererBase<TToRenderer, TFromRenderer, TInvokeFromRendererData> {
  return {
    sendMessage(data: TFromRenderer): void {
      ipcRenderer.send(channel, data);
    },

    on<Type extends EventType<TToRenderer>>(
      eventType: Type,
      func: EventHandler<EventData<TToRenderer, Type>>,
    ): UnsubscribeFn {
      const subscription = (_event: IpcRendererEvent, data: TToRenderer): void => {
        if (data.type === eventType) {
          func(data.data);
        }
      };
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },

    once<Type extends EventType<TToRenderer>>(eventType: Type, func: EventHandler<EventData<TToRenderer, Type>>): void {
      const subscription = (_event: IpcRendererEvent, data: TToRenderer): void => {
        if (data.type === eventType) {
          func(data.data);
        }
      };
      ipcRenderer.once(channel, subscription);
    },

    invoke<Type extends EventType<TInvokeFromRendererData>>(
      eventType: Type,
      data: EventData<TInvokeFromRendererData, Type>,
    ): Promise<EventResponse<TInvokeFromRendererData, Type>> {
      return ipcRenderer.invoke(channel, {
        type: eventType,
        data,
      });
    },
  };
}
