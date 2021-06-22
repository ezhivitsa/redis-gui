import React, { ReactElement, ReactNode } from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core';

import { useStyles } from 'lib/theme';

import styles from './button.pcss';

export enum ButtonSize {
  S = 's',
  M = 'm',
}

export enum ButtonView {
  Default = 'default',
  Success = 'success',
  Danger = 'danger',
}

interface Props {
  children?: ReactNode;
  className?: string;
  size: ButtonSize;
  view: ButtonView;
  onClick?: () => void;
  icon?: IconProp;
}

const mapSizeToIconSize: Record<ButtonSize, SizeProp> = {
  [ButtonSize.S]: 'sm',
  [ButtonSize.M]: '1x',
};

export function Button({ children, className, size, view, onClick, icon }: Props): ReactElement {
  const cn = useStyles(styles, 'button');

  function renderIcon(): ReactNode {
    if (!icon) {
      return null;
    }

    return (
      <span className={cn('icon')}>
        <FontAwesomeIcon icon={icon} size={mapSizeToIconSize[size]} />
      </span>
    );
  }

  return (
    <button className={classnames(cn({ size, view }), className)} onClick={onClick}>
      {renderIcon()}
      <span>{children}</span>
    </button>
  );
}

Button.defaultProps = {
  size: ButtonSize.M,
  view: ButtonView.Default,
};
