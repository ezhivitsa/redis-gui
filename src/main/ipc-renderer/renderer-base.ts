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

// export abstract class IpcRendererBase<TInput extends BaseEvent, TOutput extends BaseEvent> {
//   protected abstract channel: string;

//   sendMessage(data: TInput): void {
//     ipcRenderer.send(this.channel, data);
//   }

//   on<Type extends EventType<TOutput>>(eventType: Type, func: EventHandler<EventData<TOutput, Type>>): UnsubscribeFn {
//     const subscription = (_event: IpcRendererEvent, data: TOutput): void => {
//       if (data.type === eventType) {
//         func(data.data);
//       }
//     };
//     ipcRenderer.on(this.channel, subscription);

//     return () => {
//       ipcRenderer.removeListener(this.channel, subscription);
//     };
//   }

//   once(func: EventHandler<TOutput>): void {
//     ipcRenderer.once(this.channel, (_event, data) => func(data));
//   }
// }

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
