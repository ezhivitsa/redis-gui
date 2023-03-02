import React, { ReactElement, useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { nativeTheme } from '@electron/remote';

import { ThemeContextProvider, Theme } from 'renderer/lib/theme';

import { MainPage } from 'renderer/scenes/main-page';

import 'styles/reset.pcss';

function AppComponent(): ReactElement {
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
