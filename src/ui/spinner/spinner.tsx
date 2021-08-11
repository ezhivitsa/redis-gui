import React, { ReactElement } from 'react';

import { useStyles } from 'lib/theme';

import styles from './spinner.pcss';

export enum SpinnerView {
  Default = 'default',
  Block = 'block',
}

export enum SpinnerSize {
  XS = 'xs',
  S = 's',
  M = 'm',
}

interface Props {
  view: SpinnerView;
  size: SpinnerSize;
}

export function Spinner({ view, size }: Props): ReactElement {
  const cn = useStyles(styles, 'spinner');

  return (
    <div className={cn({ view })}>
      <div className={cn('loader', { size })}>
        <div className={cn('item', { size })} />
        <div className={cn('item', { size })} />
        <div className={cn('item', { size })} />
      </div>
    </div>
  );
}

Spinner.defaultProps = {
  view: SpinnerView.Default,
  size: SpinnerSize.M,
};
