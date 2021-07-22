import React, { ReactElement } from 'react';

import { useStyles } from 'lib/theme';

import styles from './spinner.pcss';

export enum SpinnerView {
  Default = 'default',
  Block = 'block',
}

interface Props {
  view: SpinnerView;
}

export function Spinner({ view }: Props): ReactElement {
  const cn = useStyles(styles, 'spinner');

  return (
    <div className={cn({ view })}>
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
};
