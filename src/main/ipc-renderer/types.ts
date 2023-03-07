export enum Channel {
  NATIVE_THEME = 'native-theme',
}

export type EventHandler<T> = (value: T) => void;

export type UnsubscribeFn = () => void;

export interface BaseEvent<T extends string = string, D = any> {
  type: T;
  data: D;
}

export type EventType<T> = T extends { type: string } ? T['type'] : never;

export type EventData<T, Type> = T extends { type: Type; data: any } ? T['data'] : never;
