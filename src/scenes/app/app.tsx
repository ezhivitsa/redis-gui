import React, { ReactElement, useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { remote } from 'electron';

import { ThemeContextProvider, Theme } from 'lib/theme';

import { MainPage } from 'scenes/main-page';

import 'styles/reset.pcss';

function AppComponent(): ReactElement {
  const nativeTheme = remote.nativeTheme;
  const [shouldUseDarkColors, setShouldUseDarkColors] = useState(nativeTheme.shouldUseDarkColors);

  useEffect(() => {
    nativeTheme.addListener('updated', handleThemeChange);

    return () => {
      nativeTheme.removeListener('updated', handleThemeChange);
    };
  }, []);

  function handleThemeChange(): void {
    setShouldUseDarkColors(nativeTheme.shouldUseDarkColors);
  }

  return (
    <ThemeContextProvider systemTheme={shouldUseDarkColors ? Theme.Dark : Theme.Light} useSystemTheme>
      <MainPage />
    </ThemeContextProvider>
  );
}
export const App = hot(AppComponent);
