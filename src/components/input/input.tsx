import React, { ReactElement, ReactNode, useState, useEffect, ChangeEvent, FocusEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import classnames from 'classnames';

import { useStyles } from 'lib/theme';

import styles from './input.pcss';

export enum InputSize {
  S = 's',
  M = 'm',
}

export enum InputWidth {
  Default = 'default',
  Available = 'available',
}

interface Props {
  className?: string;
  value?: string;
  label?: ReactNode;
  size?: InputSize;
  width?: InputWidth;
  id?: string;
  name?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}

export function Input({ className, value, label, size, width, name, onChange, onBlur, ...props }: Props): ReactElement {
  const cn = useStyles(styles, 'input');

  const [id, setId] = useState(props.id);

  useEffect(() => {
    if (!id) {
      setId(uuidv4());
    }
  }, [id]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    onChange?.(event.target.value, event);
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

  function renderInput(): ReactNode {
    return (
      <input
        id={id}
        name={name}
        className={cn('input', { size, width })}
        value={value}
        onBlur={onBlur}
        onChange={handleInputChange}
      />
    );
  }

  return (
    <div className={classnames(cn(), className)}>
      {renderLabel()}
      {renderInput()}
    </div>
  );
}

Input.defaultProps = {
  size: InputSize.M,
};