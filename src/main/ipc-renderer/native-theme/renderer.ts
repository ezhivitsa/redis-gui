import { IpcRendererBase } from '../renderer-base';
import { Channel, EventData, EventHandler, EventType, UnsubscribeFn } from '../types';

import { NativeThemeInputData, NativeThemeOutputData } from './types';

export class NativeThemeRenderer extends IpcRendererBase<NativeThemeInputData, NativeThemeOutputData> {
  protected channel = Channel.NATIVE_THEME;

  on<Type extends EventType<NativeThemeOutputData>>(
    eventType: Type,
    func: EventHandler<EventData<NativeThemeOutputData, Type>>,
  ): UnsubscribeFn {
    const unsubscribe = super.on(eventType, func);
    this.sendMessage({ type: 'DATA_REQUEST', data: undefined });

    return unsubscribe;
  }
}
