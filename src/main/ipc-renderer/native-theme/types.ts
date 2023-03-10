import { BaseEvent, BaseInvokeEvent } from '../types';

export interface NativeThemeData {
  shouldUseDarkColors: boolean;
}

export type NativeThemeToRendererData = BaseEvent<'NATIVE_THEME_UPDATED', NativeThemeData>;

export type NativeThemeInvokeData = BaseInvokeEvent<'GET_NATIVE_THEME', undefined, NativeThemeData>;
