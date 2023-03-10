import { getBaseIpcRenderer } from '../renderer-base';
import { Channel } from '../types';

import { NativeThemeInvokeData, NativeThemeToRendererData } from './types';

export const nativeThemeRenderer = getBaseIpcRenderer<NativeThemeToRendererData, never, NativeThemeInvokeData>(
  Channel.NATIVE_THEME,
);
