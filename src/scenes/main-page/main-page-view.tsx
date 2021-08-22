import React, { ReactElement, ReactNode, useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { throttle } from 'lodash';
import { faServer, faBan, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { useStyles } from 'lib/theme';
import { Redis } from 'lib/redis';

import { ButtonIcon } from 'ui/button-icon';

import { ConnectionsListModal } from 'scenes/connections-list-modal';
import { EditValueForm } from 'scenes/edit-value-form';

import { useStore } from './index';

import { OpenConnectionsList } from './components/open-connections-list';

import styles from './main-page.pcss';

const RESIZER_POS = 'main-page-resizer';
const DEFAULT_RESIZER_POS = 200;
const MOVE_THROTTLE = 100;

interface Action {
  icon: IconProp;
  onClick: () => void;
  disabled?: boolean;
}

export const MainPageView = observer((): ReactElement => {
  const cn = useStyles(styles, 'main-page');

  const pos = localStorage.getItem(RESIZER_POS);
  const [connectionsWidth, setConnectionsWidth] = useState(pos !== null ? parseInt(pos, 10) : DEFAULT_RESIZER_POS);
  const [resizerActive, setResizerActive] = useState(false);

  const [startResizerX, setStartResizerX] = useState(0);
  const [currentResizerX, setCurrentResizerX] = useState(0);

  const connectionsRef = useRef<HTMLDivElement>(null);

  const pageStore = useStore();
  const { connectionsListOpened, openConnections, hasActiveTab, isDeleting } = pageStore;

  const handleMouseMoveThrottled = throttle(handleMouseMove, MOVE_THROTTLE);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMoveThrottled);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMoveThrottled);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseUp);
    };
  });

  function handleOpenConnections(): void {
    pageStore.setConnectionsListOpened(true);
  }

  function handleConnectionsModalClose(): void {
    pageStore.setConnectionsListOpened(false);
  }

  function handleMouseMove(event: MouseEvent): void {
    if (!resizerActive) {
      return;
    }

    setCurrentResizerX(event.clientX);
  }

  function handleMouseUp(): void {
    if (!resizerActive) {
      return;
    }

    setResizerActive(false);

    if (connectionsRef.current) {
      const width = connectionsRef.current.scrollWidth;
      setConnectionsWidth(width);
      localStorage.setItem(RESIZER_POS, width.toString());
    }

    setStartResizerX(0);
    setCurrentResizerX(0);
  }

  function handleResizeStart(event: React.MouseEvent): void {
    setResizerActive(true);

    setStartResizerX(event.clientX);
    setCurrentResizerX(event.clientX);
  }

  function handleConnect(redis: Redis): void {
    pageStore.addOpenConnection(redis);
  }

  function handleDeleteKey(): void {
    pageStore.deleteActiveKey();
  }

  function handleCancelSelect(): void {
    pageStore.cancelActiveKey();
  }

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
      <div className={cn('actions')}>
        {renderKeyActions([
          {
            icon: faServer,
            onClick: handleOpenConnections,
          },
        ])}
        {hasActiveTab &&
          renderKeyActions([
            {
              icon: faBan,
              onClick: handleCancelSelect,
              disabled: isDeleting,
            },
            {
              icon: faTrash,
              onClick: handleDeleteKey,
              disabled: isDeleting,
            },
          ])}
      </div>

      <div className={cn('data-wrap')}>
        <div
          className={cn('connections')}
          style={{ width: Math.max(connectionsWidth + currentResizerX - startResizerX, 0) }}
          ref={connectionsRef}
        >
          <OpenConnectionsList />

          <div
            className={cn('resizer', { active: resizerActive })}
            onMouseDown={handleResizeStart}
            role="button"
            tabIndex={0}
          />
        </div>

        <div className={cn('data')}>
          {openConnections.length > 0 && <EditValueForm connections={openConnections} />}
        </div>
      </div>

      <ConnectionsListModal
        open={connectionsListOpened}
        onClose={handleConnectionsModalClose}
        onConnect={handleConnect}
      />
    </div>
  );
});
