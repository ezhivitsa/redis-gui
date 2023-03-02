import React, { ReactElement, ReactNode } from 'react';

import { useStyles } from 'renderer/lib/theme';

import styles from './paragraph.pcss';

export enum ParagraphSize {
  S = 's',
  M = 'm',
  L = 'l',
}

interface Props {
  children?: ReactNode;
  className?: string;
  size: ParagraphSize;
}

export function Paragraph({ children, className, size }: Props): ReactElement {
  const cn = useStyles(styles, 'paragraph', className);

  return <p className={cn({ size })}>{children}</p>;
}

Paragraph.defaultProps = {
  size: ParagraphSize.M,
};
