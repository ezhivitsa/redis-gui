import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { throttle } from 'lodash';
import { faServer } from '@fortawesome/free-solid-svg-icons';

import { useStyles } from 'lib/theme';

import { ButtonIcon } from 'ui/button-icon';

import { ConnectionsListModal } from 'scenes/connections-list-modal';

import { useStore } from './index';

import { OpenConnectionsList } from './components/open-connections-list';

import styles from './main-page.pcss';

const RESIZER_POS = 'main-page-resizer';
const DEFAULT_RESIZER_POS = 200;
const MOVE_THROTTLE = 100;

export const MainPageView = observer((): ReactElement => {
  const cn = useStyles(styles, 'main-page');

  const pos = localStorage.getItem(RESIZER_POS);
  const [connectionsWidth, setConnectionsWidth] = useState(pos !== null ? parseInt(pos, 10) : DEFAULT_RESIZER_POS);
  const [resizerActive, setResizerActive] = useState(false);

  const [startResizerX, setStartResizerX] = useState(0);
  const [currentResizerX, setCurrentResizerX] = useState(0);

  const connectionsRef = useRef<HTMLDivElement>(null);

  const pageStore = useStore();
  const { connectionsListOpened } = pageStore;

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

  return (
    <div className={cn()}>
      <div className={cn('actions')}>
        <ButtonIcon icon={faServer} size="lg" onClick={handleOpenConnections} />
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
        <div className={cn('data')} />
      </div>

      <ConnectionsListModal open={connectionsListOpened} onClose={handleConnectionsModalClose} />
    </div>
  );
});
