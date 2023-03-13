import { BrowserWindow } from 'electron';

export enum Channel {
  NATIVE_THEME = 'native-theme',
  MENU = 'menu',
  REDIS = 'redis',
}

export type EventHandler<T> = (value: T) => void;

export type UnsubscribeFn = () => void;

export interface BaseEvent<T extends string = string, D = any> {
  type: T;
  data: D;
}

export interface BaseInvokeEvent<T extends string = string, D = any, R = any> {
  type: T;
  data: D;
  response: R;
}

export type EventType<T> = T extends { type: string } ? T['type'] : never;

export type EventData<T, Type> = T extends { type: Type; data: any } ? T['data'] : never;

export type EventAnyData<T> = T extends { data: any } ? T['data'] : never;

export type EventResponse<T, Type> = T extends { type: Type; response: any } ? T['response'] : never;

export type EventAnyResponse<T> = T extends { response: any } ? T['response'] : never;

export type InvokeListener<TInvokeFromRendererData extends BaseInvokeEvent, Type> = (
  data: EventData<TInvokeFromRendererData, Type>,
) => Promise<EventResponse<TInvokeFromRendererData, Type>>;

export interface IpcRendererBase<
  TToRenderer extends BaseEvent,
  TFromRenderer extends BaseEvent,
  TInvokeFromRendererData extends BaseInvokeEvent,
> {
  sendMessage(data: TFromRenderer): void;
  on<Type extends EventType<TToRenderer>>(
    eventType: Type,
    func: EventHandler<EventData<TToRenderer, Type>>,
  ): UnsubscribeFn;
  once<Type extends EventType<TToRenderer>>(eventType: Type, func: EventHandler<EventData<TToRenderer, Type>>): void;
  invoke<Type extends EventType<TInvokeFromRendererData>>(
    eventType: Type,
    data: EventData<TInvokeFromRendererData, Type>,
  ): Promise<EventResponse<TInvokeFromRendererData, Type>>;
}

export interface IpcMainBase<
  TToRenderer extends BaseEvent,
  TFromRenderer extends BaseEvent,
  TInvokeFromRendererData extends BaseInvokeEvent,
> {
  initialize(mainWindow: BrowserWindow): void;
  destroy(): void;
  on<Type extends EventType<TFromRenderer>>(
    eventType: Type,
    func: EventHandler<EventData<TFromRenderer, Type>>,
  ): UnsubscribeFn;
  once<Type extends EventType<TFromRenderer>>(
    eventType: Type,
    func: EventHandler<EventData<TFromRenderer, Type>>,
  ): void;
  sendMessage(data: TToRenderer): void;
  handle<Type extends EventType<TInvokeFromRendererData>>(
    eventType: Type,
    handler: InvokeListener<TInvokeFromRendererData, Type>,
  ): void;
}
