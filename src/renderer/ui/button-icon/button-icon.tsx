import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { ReactElement } from 'react';

import { useStyles } from 'renderer/lib/theme';

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
  disabled?: boolean;
}

export function ButtonIcon({ className, size, view, icon, disabled, onClick }: Props): ReactElement {
  const cn = useStyles(styles, 'button-icon');

  function handleClick(): void {
    if (disabled) {
      return;
    }

    onClick?.();
  }

  return (
    <FontAwesomeIcon
      className={classnames(cn({ view, disabled }), className)}
      icon={icon}
      size={size}
      onClick={handleClick}
    />
  );
}

ButtonIcon.defaultProps = {
  view: ButtonIconView.Default,
};
