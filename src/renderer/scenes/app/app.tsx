import { nativeTheme } from '@electron/remote';
import { ReactElement, useEffect, useState } from 'react';

import { Theme, ThemeContextProvider } from 'renderer/lib/theme';

import { MainPage } from 'renderer/scenes/main-page';

import 'styles/reset.pcss';

export function App(): ReactElement {
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
