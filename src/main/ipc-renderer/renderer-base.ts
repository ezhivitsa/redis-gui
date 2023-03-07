import { IpcRendererEvent, ipcRenderer } from 'electron';

import { BaseEvent, EventData, EventHandler, EventType, UnsubscribeFn } from './types';

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

interface IpcRendererBase<TInput extends BaseEvent, TOutput extends BaseEvent> {
  sendMessage(data: TInput): void;
  on<Type extends EventType<TOutput>>(eventType: Type, func: EventHandler<EventData<TOutput, Type>>): UnsubscribeFn;
  once(func: EventHandler<TOutput>): void;
}

export function getBaseIpcRenderer(channel: string): IpcRendererBase {
  return {};
}
