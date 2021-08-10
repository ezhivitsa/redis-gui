import React, { ReactElement } from 'react';

import { useStyles } from 'lib/theme';

import styles from './spinner.pcss';

export enum SpinnerView {
  Default = 'default',
  Block = 'block',
}

export enum SpinnerSize {
  XS = 'sx',
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
    <div className={cn({ view, size })}>
      <div className={cn('loader')}>
        <div className={cn('item')} />
        <div className={cn('item')} />
        <div className={cn('item')} />
      </div>
    </div>
  );
}

Spinner.defaultProps = {
  view: SpinnerView.Default,
  size: SpinnerSize.M,
};
