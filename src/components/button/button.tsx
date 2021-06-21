import React, { ReactElement, ReactNode } from 'react';

import { useStyles } from 'lib/theme';

import styles from './button.pcss';

export enum ButtonSize {
  S = 's',
  M = 'm',
}

export enum ButtonView {
  Default = 'default',
  Success = 'success',
}

interface Props {
  children?: ReactNode;
  size: ButtonSize;
  view: ButtonView;
  onClick?: () => void;
}

export function Button({ children, size, onClick }: Props): ReactElement {
  const cn = useStyles(styles, 'button');

  return (
    <button className={cn({ size })} onClick={onClick}>
      {children}
    </button>
  );
}

Button.defaultProps = {
  size: ButtonSize.M,
  view: ButtonView.Default,
};
