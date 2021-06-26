import React, { ReactElement } from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core';

import { useStyles } from 'lib/theme';

import styles from './button-icon.pcss';

export enum ButtonIconView {
  Default = 'default',
  Success = 'success',
  Danger = 'danger',
}

interface Props {
  className?: string;
  size?: SizeProp;
  icon: IconProp;
  view: ButtonIconView;
  onClick?: () => void;
}

export function ButtonIcon({ className, size, view, icon, onClick }: Props): ReactElement {
  const cn = useStyles(styles, 'button-icon');

  return <FontAwesomeIcon className={classnames(cn({ view }), className)} icon={icon} size={size} onClick={onClick} />;
}

ButtonIcon.defaultProps = {
  view: ButtonIconView.Default,
};
