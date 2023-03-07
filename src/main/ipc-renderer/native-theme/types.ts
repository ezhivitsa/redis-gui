import { BaseEvent } from '../types';

export interface UpdatedNativeThemeData {
  shouldUseDarkColors: boolean;
}

export type NativeThemeOutputData = BaseEvent<'NATIVE_THEME_UPDATED', UpdatedNativeThemeData>;

export type NativeThemeInputData = BaseEvent<'DATA_REQUEST'>;
