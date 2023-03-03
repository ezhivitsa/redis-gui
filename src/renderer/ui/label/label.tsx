import classnames from 'classnames';
import { ReactElement, ReactNode } from 'react';

import { useStyles } from 'renderer/lib/theme';

import styles from './label.pcss';

export enum LabelSize {
  S = 's',
  M = 'm',
}

interface Props {
  size: LabelSize;
  children?: ReactNode;
  className?: string;
}

export function Label({ size, children, className }: Props): ReactElement {
  const cn = useStyles(styles, 'label');

  return <div className={classnames(cn({ size }), className)}>{children}</div>;
}

Label.defaultProps = { size: LabelSize.M };
