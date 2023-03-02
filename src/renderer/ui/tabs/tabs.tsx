import React, { ReactElement, ReactNode } from 'react';
import classnames from 'classnames';

import { useStyles } from 'renderer/lib/theme';
import { handleEnterEvent } from 'renderer/lib/keyboard';

import styles from './tabs.pcss';

export interface TabItem<V extends string | number> {
  value: V;
  text: ReactNode;
}

interface Props<V extends string | number> {
  items: TabItem<V>[];
  active: V;
  className?: string;
  onChange?: (value: V) => void;
}

export function Tabs<V extends string | number>({ items, active, onChange, className }: Props<V>): ReactElement {
  const cn = useStyles(styles, 'tabs');

  function handleItemClick(item: TabItem<V>) {
    return () => {
      onChange?.(item.value);
    };
  }

  function renderItem(item: TabItem<V>): ReactNode {
    return (
      <div
        key={item.value}
        className={cn('item', { active: active === item.value })}
        role="button"
        tabIndex={0}
        onClick={handleItemClick(item)}
        onKeyDown={handleEnterEvent(handleItemClick(item))}
      >
        {item.text}
      </div>
    );
  }

  return <div className={classnames(cn(), className)}>{items.map(renderItem)}</div>;
}
