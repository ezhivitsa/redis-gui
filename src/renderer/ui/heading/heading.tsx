import React, { ReactElement, ReactNode } from 'react';
import classnames from 'classnames';

import { useStyles } from 'renderer/lib/theme';

import styles from './heading.pcss';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export enum HeadingSize {
  XS = 'xs',
  S = 's',
  M = 'm',
  L = 'l',
  XL = 'xl',
}

export enum HeadingView {
  Default = 'default',
  Condensed = 'condensed',
}

interface Props {
  size: HeadingSize;
  view: HeadingView;
  children?: ReactNode;
  className?: string;
}

const mapSizeToLevel: Record<HeadingSize, HeadingLevel> = {
  [HeadingSize.XL]: 1,
  [HeadingSize.L]: 2,
  [HeadingSize.M]: 3,
  [HeadingSize.S]: 4,
  [HeadingSize.XS]: 5,
};

export function Heading({ size, view, children, className }: Props): ReactElement {
  const cn = useStyles(styles, 'heading');

  const headingProps = {
    className: classnames(
      cn({
        size,
        view,
      }),
      className,
    ),
  };

  return React.createElement(`h${mapSizeToLevel[size]}`, headingProps, children);
}

Heading.defaultProps = {
  size: HeadingSize.L,
  view: HeadingView.Default,
};
