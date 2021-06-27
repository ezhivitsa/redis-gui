import React, { ReactElement, ReactNode, useState, useEffect, ChangeEvent, FocusEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import classnames from 'classnames';

import { useStyles } from 'lib/theme';
import { handleEnterEvent } from 'lib/keyboard';

import styles from './input.pcss';

export enum InputSize {
  S = 's',
  M = 'm',
}

export enum InputWidth {
  Default = 'default',
  Available = 'available',
}

export type InputType = 'text' | 'password';

export interface InputProps {
  className?: string;
  value?: string;
  label?: ReactNode;
  size?: InputSize;
  width?: InputWidth;
  id?: string;
  name?: string;
  type?: InputType;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  rightAddon?: ReactNode;
  onRightAddonClick?: () => void;
}

export function Input({
  className,
  value,
  label,
  size,
  width,
  name,
  type,
  onChange,
  onBlur,
  rightAddon,
  onRightAddonClick,
  ...props
}: InputProps): ReactElement {
  const cn = useStyles(styles, 'input');

  const [id, setId] = useState(props.id);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!id) {
      setId(uuidv4());
    }
  }, [id]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    onChange?.(event.target.value, event);
  }

  function handleFocus(): void {
    setFocused(true);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>): void {
    setFocused(false);
    onBlur?.(event);
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
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleInputChange}
        type={type}
      />
    );
  }

  function renderRightAddon(): ReactNode {
    if (!rightAddon) {
      return null;
    }

    return (
      <div
        className={cn('right-addon', { withClick: Boolean(onRightAddonClick) })}
        role={onRightAddonClick ? 'button' : undefined}
        tabIndex={onRightAddonClick ? -1 : undefined}
        onClick={onRightAddonClick}
        onKeyDown={onRightAddonClick ? handleEnterEvent(onRightAddonClick) : undefined}
      >
        {rightAddon}
      </div>
    );
  }

  return (
    <div className={classnames(cn(), className)}>
      {renderLabel()}

      <div className={cn('inner', { focused, size, withRightAddon: Boolean(rightAddon) })}>
        {renderInput()}
        {renderRightAddon()}
      </div>
    </div>
  );
}

Input.defaultProps = {
  size: InputSize.M,
  value: '',
};
