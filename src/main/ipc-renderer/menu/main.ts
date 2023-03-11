import { getIpcMainBase } from '../main-base';
import { Channel } from '../types';

import { MenuToRendererData } from './types';

export const menuMain = getIpcMainBase<MenuToRendererData, never, never>(Channel.MENU);
