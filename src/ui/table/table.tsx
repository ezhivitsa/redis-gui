import React, { ReactElement, ReactNode, CSSProperties, KeyboardEvent, useState, useEffect, useRef } from 'react';

import { useStyles } from 'lib/theme';
import { isEnterEvent } from 'lib/keyboard';

import styles from './table.pcss';

export enum TableSize {
  S = 's',
  M = 'm',
}

interface Props<C extends string, D extends Record<string, any>> {
  columns: C[];
  data: D[];
  renderColumn: (column: C, item: D) => ReactNode;
  onRowClick?: (item: D) => void;
  onRowDoubleClick?: (item: D) => void;
  onClickOutside?: () => void;
  heading: Record<C, string>;
  columnStyle?: Partial<Record<C, CSSProperties>>;
  gridTemplateColumns?: string;
  size: TableSize;
  className?: string;
  activeItem?: D;
}

export function Table<C extends string, D extends Record<string, any>>({
  columns,
  data,
  heading,
  renderColumn,
  onRowClick,
  onRowDoubleClick,
  onClickOutside,
  columnStyle,
  gridTemplateColumns,
  size,
  className,
  activeItem,
}: Props<C, D>): ReactElement {
  const cn = useStyles(styles, 'table', className);
  const [hoverItem, setHoverItem] = useState<D | null>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  const selectable = Boolean(onRowClick);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  });

  function handleDocumentClick(event: MouseEvent): void {
    const { current } = rowsRef;
    const { target } = event;

    if (!current || !(target instanceof HTMLElement)) {
      return;
    }

    if (!current.contains(target)) {
      onClickOutside?.();
    }
  }

  function handleRowClick(item: D) {
    return () => {
      onRowClick?.(item);
    };
  }

  function handleRowDoubleClick(item: D) {
    return () => {
      onRowDoubleClick?.(item);
    };
  }

  function handleRowKeyDown(item: D) {
    return (event: KeyboardEvent) => {
      if (isEnterEvent(event)) {
        onRowClick?.(item);
      }
    };
  }

  function handleMouseOver(item: D) {
    return () => {
      setHoverItem(item);
    };
  }

  function handleMouseOut(item: D) {
    return () => {
      if (hoverItem === item) {
        setHoverItem(null);
      }
    };
  }

  function renderHeadings(): ReactNode[] {
    return columns.map((column) => (
      <div key={`heading-${column}`} className={cn('heading', { size })} style={columnStyle?.[column]}>
        {heading[column]}
      </div>
    ));
  }

  function renderRowColumns(item: D, index: number): ReactNode[] {
    return columns.map((column) => (
      <div
        key={`column-${column}-${item.id || index}`}
        className={cn('column', { size, selectable, hovered: item === hoverItem, active: item === activeItem })}
        style={columnStyle?.[column]}
        role="button"
        tabIndex={0}
        onClick={handleRowClick(item)}
        onDoubleClick={handleRowDoubleClick(item)}
        onKeyDown={handleRowKeyDown(item)}
        onMouseOver={selectable ? handleMouseOver(item) : undefined}
        onFocus={selectable ? handleMouseOver(item) : undefined}
        onMouseOut={selectable ? handleMouseOut(item) : undefined}
        onBlur={selectable ? handleMouseOut(item) : undefined}
      >
        {renderColumn(column, item)}
      </div>
    ));
  }

  function renderRows(): ReactNode[] {
    return data.reduce<ReactNode[]>((res, dataItem, index) => res.concat(renderRowColumns(dataItem, index)), []);
  }

  return (
    <div className={cn()}>
      <div
        className={cn('rows')}
        ref={rowsRef}
        style={{
          gridTemplateColumns: gridTemplateColumns || `repeat(${columns.length}, 1fr)`,
        }}
      >
        {renderHeadings()}
        {renderRows()}
      </div>
    </div>
  );
}

Table.defaultProps = {
  size: TableSize.M,
};
