// import { nativeTheme } from '@electron/remote';
import { ReactElement, useEffect, useState } from 'react';

import { UpdatedNativeThemeData } from 'main/ipc-renderer/native-theme/types';

// import { Theme, ThemeContextProvider } from 'renderer/lib/theme';

// import { MainPage } from 'renderer/scenes/main-page';

// import 'renderer/styles/reset.pcss';

export function App(): ReactElement {
  const [shouldUseDarkColors, setShouldUseDarkColors] = useState(false);

  useEffect(() => {
    console.log(window.electron.nativeTheme);
    const unsubscribe = window.electron.nativeTheme.on('NATIVE_THEME_UPDATED', handleThemeChange);

    return () => {
      unsubscribe();
    };
  }, []);

  function handleThemeChange({ shouldUseDarkColors }: UpdatedNativeThemeData): void {
    setShouldUseDarkColors(shouldUseDarkColors);
  }

  return <div>shouldUseDarkColors: {shouldUseDarkColors}</div>;

  // return (
  //   <ThemeContextProvider systemTheme={shouldUseDarkColors ? Theme.Dark : Theme.Light} useSystemTheme>
  //     <MainPage />
  //   </ThemeContextProvider>
  // );
}
