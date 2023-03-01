import { block, ClassNameGenerator } from 'lib/bem';

import { useTheme } from './context';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useStyles<S extends Record<string, any>>(
  styles: S,
  className: string,
  additionalClassName?: string,
): ClassNameGenerator {
  const [theme] = useTheme();

  return block(styles, className, theme, additionalClassName);
}
