import React, { ReactElement, ReactNode, useState, useRef, useEffect, useCallback } from 'react';
import { throttle } from 'lodash';

import { useStyles } from 'renderer/lib/theme';

import styles from './resizable-layout.pcss';

interface Props {
  left: ReactNode;
  right: ReactNode;
}

const RESIZER_POS = 'main-page-resizer';
const DEFAULT_RESIZER_POS = 200;
const MOVE_THROTTLE = 50;
const NO_VALUE = -1;

export function ResizableLayout({ left, right }: Props): ReactElement {
  const cn = useStyles(styles, 'resizable-layout');

  const pos = localStorage.getItem(RESIZER_POS);
  const [connectionsWidth, setConnectionsWidth] = useState(pos !== null ? parseInt(pos, 10) : DEFAULT_RESIZER_POS);
  const [resizerActive, setResizerActive] = useState(false);

  const [startResizerX, setStartResizerX] = useState(NO_VALUE);
  const [currentResizerX, setCurrentResizerX] = useState(NO_VALUE);

  const connectionsRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (event: MouseEvent): void => {
      if (!resizerActive) {
        return;
      }

      setCurrentResizerX(event.clientX);
    },
    [resizerActive],
  );

  const handleMouseUp = useCallback((): void => {
    if (!resizerActive) {
      return;
    }

    setResizerActive(false);

    if (connectionsRef.current) {
      const width = connectionsRef.current.getBoundingClientRect().width;
      setConnectionsWidth(width);
      localStorage.setItem(RESIZER_POS, width.toString());
    }

    setStartResizerX(NO_VALUE);
    setCurrentResizerX(NO_VALUE);
  }, [resizerActive]);

  const handleMouseMoveThrottled = useCallback(throttle(handleMouseMove, MOVE_THROTTLE), [resizerActive]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMoveThrottled);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMoveThrottled);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [handleMouseMoveThrottled, handleMouseMove, handleMouseUp]);

  function handleResizeStart(event: React.MouseEvent): void {
    setResizerActive(true);

    setStartResizerX(event.clientX);
    setCurrentResizerX(event.clientX);
  }

  return (
    <div className={cn({ active: resizerActive })}>
      <div
        className={cn('left', { active: resizerActive })}
        style={{
          width:
            startResizerX === NO_VALUE
              ? connectionsWidth
              : Math.max(connectionsWidth + currentResizerX - startResizerX, 0),
        }}
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

      <div className={cn('right', { active: resizerActive })}>{right}</div>
    </div>
  );
}
