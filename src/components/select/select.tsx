/* eslint-disable jsx-a11y/no-onchange */

import React, { ReactElement, ReactNode, ChangeEvent, FocusEvent, useState, useEffect } from 'react';
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

import { useStyles } from 'lib/theme';

import styles from './select.pcss';

export enum SelectSize {
  S = 's',
  M = 'm',
}

export enum SelectWidth {
  Default = 'default',
  Available = 'available',
}

export interface SelectItem<V extends string> {
  value: V;
  text: string;
}

interface Props<V extends string> {
  size?: SelectSize;
  width?: SelectWidth;
  className?: string;
  label?: ReactNode;
  id?: string;
  value?: V;
  items: SelectItem<V>[];
  onChange?: (event: ChangeEvent<HTMLSelectElement>, value: V) => void;
  onBlur?: (event: FocusEvent<HTMLSelectElement>) => void;
}

export function Select<V extends string>({
  size,
  width,
  className,
  label,
  items,
  value,
  onChange,
  onBlur,
  ...props
}: Props<V>): ReactElement {
  const cn = useStyles(styles, 'select');

  const [id, setId] = useState(props.id);

  useEffect(() => {
    if (!id) {
      setId(uuidv4());
    }
  }, [id]);

  function handleSelectChange(event: ChangeEvent<HTMLSelectElement>): void {
    onChange?.(event, event.target.value as V);
  }

  function renderLabel(): ReactNode {
    if (!label) {
      return null;
    }

    return (
      <label className={cn('label', { size })} htmlFor={id}>
        {label}
      </label>
    );
  }

  function renderOption(item: SelectItem<V>): ReactNode {
    return (
      <option key={item.value} value={item.value}>
        {item.text}
      </option>
    );
  }

  function renderSelect(): ReactNode {
    return (
      <select
        id={id}
        className={cn('select', { size, width })}
        onChange={handleSelectChange}
        onBlur={onBlur}
        value={value}
      >
        {items.map(renderOption)}
      </select>
    );
  }

  return (
    <div className={classnames(cn(), className)}>
      {renderLabel()}
      {renderSelect()}
    </div>
  );
}

Select.defaultProps = {
  size: SelectSize.S,
};
