import React, { ReactElement } from 'react';
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
  size?: SizeProp;
  icon: IconProp;
  view: ButtonIconView;
  onClick?: () => void;
}

export function ButtonIcon({ size, view, icon, onClick }: Props): ReactElement {
  const cn = useStyles(styles, 'button-icon');

  return <FontAwesomeIcon className={cn({ view })} icon={icon} size={size} onClick={onClick} />;
}

ButtonIcon.defaultProps = {
  view: ButtonIconView.Default,
};
