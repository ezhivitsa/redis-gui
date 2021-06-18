import { block, ClassNameGenerator } from 'lib/bem';

import { useTheme } from './context';

export function useStyles<S extends Record<string, any>>(styles: S, className: string): ClassNameGenerator {
  const [theme] = useTheme();

  return block(styles, className, theme);
}
