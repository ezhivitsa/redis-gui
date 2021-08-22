import React, { ReactElement, ReactNode, useState } from 'react';

import { ThemeContext } from './context';
import { Theme } from './types';

interface Props {
  children: ReactNode;
  systemTheme: Theme;
  useSystemTheme?: boolean;
}

const THEME_ITEM = 'theme';
const themesList = Object.values(Theme) as string[];

export function ThemeContextProvider({ children, systemTheme, useSystemTheme }: Props): ReactElement {
  function setTheme(type: Theme): void {
    window.localStorage?.setItem(THEME_ITEM, type);
    setStateTheme(type);
  }

  const storageTheme = window.localStorage?.getItem(THEME_ITEM);
  const initialTheme =
    systemTheme || (storageTheme && themesList.includes(storageTheme) ? (storageTheme as Theme) : Theme.Light);

  const [theme, setStateTheme] = useState(initialTheme);

  return (
    <ThemeContext.Provider value={[useSystemTheme ? systemTheme : theme, setTheme]}>{children}</ThemeContext.Provider>
  );
}
