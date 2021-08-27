import React, { ReactElement, ReactNode, useState, useRef, useEffect } from 'react';
import { throttle } from 'lodash';

import { useStyles } from 'lib/theme';

import styles from './resizable-layout.pcss';

interface Props {
  left: ReactNode;
  right: ReactNode;
}

const RESIZER_POS = 'main-page-resizer';
const DEFAULT_RESIZER_POS = 200;
const MOVE_THROTTLE = 80;

export function ResizableLayout({ left, right }: Props): ReactElement {
  const cn = useStyles(styles, 'resizable-layout');

  const pos = localStorage.getItem(RESIZER_POS);
  const [connectionsWidth, setConnectionsWidth] = useState(pos !== null ? parseInt(pos, 10) : DEFAULT_RESIZER_POS);
  const [resizerActive, setResizerActive] = useState(false);

  const [startResizerX, setStartResizerX] = useState(0);
  const [currentResizerX, setCurrentResizerX] = useState(0);

  const connectionsRef = useRef<HTMLDivElement>(null);

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
      <div
        className={cn('left')}
        style={{ width: Math.max(connectionsWidth + currentResizerX - startResizerX, 0) }}
        ref={connectionsRef}
      >
        {left}

        <div
          className={cn('resizer', { active: resizerActive })}
          onMouseDown={handleResizeStart}
          role="button"
          tabIndex={0}
        />
      </div>

      <div className={cn('right')}>{right}</div>
    </div>
  );
}
