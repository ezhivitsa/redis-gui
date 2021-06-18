/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext } from 'react';

import { Theme } from './types';

type ThemeData = [Theme, (theme: Theme) => void];

export const ThemeContext = createContext<ThemeData>([Theme.Light, () => {}]);

export const useTheme = (): ThemeData => useContext(ThemeContext);
