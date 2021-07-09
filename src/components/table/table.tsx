import React, { ReactElement, ReactNode, CSSProperties, KeyboardEvent } from 'react';

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
  heading: Record<C, string>;
  style?: Partial<Record<C, CSSProperties>>;
  size: TableSize;
  className?: string;
}

export function Table<C extends string, D extends Record<string, any>>({
  columns,
  data,
  heading,
  renderColumn,
  onRowClick,
  onRowDoubleClick,
  style,
  size,
  className,
}: Props<C, D>): ReactElement {
  const cn = useStyles(styles, 'table', className);

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

  function renderHeadings(): ReactNode[] {
    return columns.map((column, index) => (
      <div
        key={`heading-${column}`}
        className={cn('column', { heading: true, firstColumn: index === 0, size })}
        style={style?.[column]}
      >
        {heading[column]}
      </div>
    ));
  }

  function renderRowColumns(item: D): ReactNode[] {
    return columns.map((column) => (
      <div
        key={`column-${column}`}
        className={cn('column')}
        style={style?.[column]}
        role="button"
        tabIndex={0}
        onClick={handleRowClick(item)}
        onDoubleClick={handleRowDoubleClick(item)}
        onKeyDown={handleRowKeyDown(item)}
      >
        {renderColumn(column, item)}
      </div>
    ));
  }

  function renderRows(): ReactNode[] {
    return data.reduce<ReactNode[]>((res, dataItem) => res.concat(renderRowColumns(dataItem)), []);
  }

  return (
    <div
      className={cn()}
      style={{
        gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
      }}
    >
      {renderHeadings()}
      {renderRows()}
    </div>
  );
}

Table.defaultProps = {
  size: TableSize.M,
};
