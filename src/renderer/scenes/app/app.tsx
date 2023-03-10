import { ReactElement, useEffect, useState } from 'react';

import { NativeThemeData } from 'main/ipc-renderer/native-theme/types';

import { Theme, ThemeContextProvider } from 'renderer/lib/theme';

// import { MainPage } from 'renderer/scenes/main-page';
import 'renderer/styles/reset.pcss';

export function App(): ReactElement {
  const [shouldUseDarkColors, setShouldUseDarkColors] = useState(false);

  useEffect(() => {
    getNativeThemeData();
  }, []);

  useEffect(() => {
    const unsubscribe = window.electron.nativeTheme.on('NATIVE_THEME_UPDATED', handleThemeChange);

    return () => {
      unsubscribe();
    };
  }, []);

  async function getNativeThemeData(): Promise<void> {
    const { shouldUseDarkColors } = await window.electron.nativeTheme.invoke('GET_NATIVE_THEME', undefined);
    setShouldUseDarkColors(shouldUseDarkColors);
  }

  function handleThemeChange({ shouldUseDarkColors }: NativeThemeData): void {
    console.log('handleThemeChange', shouldUseDarkColors);
    setShouldUseDarkColors(shouldUseDarkColors);
  }

  return (
    <ThemeContextProvider systemTheme={shouldUseDarkColors ? Theme.Dark : Theme.Light} useSystemTheme>
      Test
      {/* <MainPage /> */}
    </ThemeContextProvider>
  );
}
