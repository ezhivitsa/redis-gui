import React, { ReactElement, ReactNode } from 'react';
import { faServer, faBan, faTrash, faEject } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { useStyles } from 'renderer/lib/theme';

import { ButtonIcon } from 'renderer/ui/button-icon';

import styles from './top-actions.pcss';

interface Props {
  hasSelectedItem: boolean;
  hasActiveTab: boolean;
  isDisconnecting: boolean;
  isDeleting: boolean;
  onOpenConnections: () => void;
  onDisconnect: () => void;
  onCancelSelect: () => void;
  onDeleteKey: () => void;
}

interface Action {
  icon: IconProp;
  onClick: () => void;
  disabled?: boolean;
}

export function TopActions({
  hasSelectedItem,
  hasActiveTab,
  isDisconnecting,
  isDeleting,
  onOpenConnections,
  onDisconnect,
  onCancelSelect,
  onDeleteKey,
}: Props): ReactElement {
  const cn = useStyles(styles, 'top-actions');

  function renderKeyActions(actions: Action[]): ReactNode {
    return (
      <div className={cn('actions-group')}>
        {actions.map(({ icon, onClick }, index) => (
          <ButtonIcon key={index} className={cn('action')} icon={icon} size="lg" onClick={onClick} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn()}>
      {renderKeyActions([
        {
          icon: faServer,
          onClick: onOpenConnections,
        },
      ])}
      {hasSelectedItem &&
        renderKeyActions([
          {
            icon: faEject,
            onClick: onDisconnect,
            disabled: isDisconnecting,
          },
        ])}
      {hasActiveTab &&
        renderKeyActions([
          {
            icon: faBan,
            onClick: onCancelSelect,
            disabled: isDeleting || isDisconnecting,
          },
          {
            icon: faTrash,
            onClick: onDeleteKey,
            disabled: isDeleting || isDisconnecting,
          },
        ])}
    </div>
  );
}
