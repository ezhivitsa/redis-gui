import { getBaseIpcRenderer } from '../renderer-base';
import { Channel } from '../types';

import { MenuToRendererData } from './types';

export const menuRenderer = getBaseIpcRenderer<MenuToRendererData, never, never>(Channel.MENU);
