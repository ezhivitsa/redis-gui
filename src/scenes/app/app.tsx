import React, { ReactElement } from 'react';
import { hot } from 'react-hot-loader/root';
import { remote } from 'electron';

import { ThemeContextProvider, Theme } from 'lib/theme';

import { MainPage } from 'scenes/main-page';

import 'styles/reset.pcss';

function AppComponent(): ReactElement {
  const { shouldUseDarkColors } = remote.nativeTheme;

  return (
    <ThemeContextProvider storageTheme={shouldUseDarkColors ? Theme.Dark : Theme.Light}>
      <MainPage />
    </ThemeContextProvider>
  );
}
export const App = hot(AppComponent);
