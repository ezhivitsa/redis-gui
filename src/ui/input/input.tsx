import React, { ReactElement, ReactNode, useState, ChangeEvent, FocusEvent } from 'react';
import classnames from 'classnames';

import { useStyles } from 'lib/theme';
import { handleEnterEvent } from 'lib/keyboard';

import { useIdHook } from 'hooks';

import styles from './input.pcss';

export enum InputSize {
  S = 's',
  M = 'm',
}

export enum InputWidth {
  Default = 'default',
  Available = 'available',
}

export type InputType = 'text' | 'password' | 'number';

export interface InputProps {
  className?: string;
  value?: string;
  label?: ReactNode;
  size?: InputSize;
  width?: InputWidth;
  id?: string;
  name?: string;
  type?: InputType;
  hint?: ReactNode;
  step?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
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
  hint,
  disabled,
  step,
  min,
  max,
  onChange,
  onBlur,
  rightAddon,
  onRightAddonClick,
  ...props
}: InputProps): ReactElement {
  const cn = useStyles(styles, 'input');

  const id = useIdHook(props.id);
  const [focused, setFocused] = useState(false);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    if (!disabled) {
      onChange?.(event.target.value, event);
    }
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
        step={step}
        min={min}
        max={max}
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
        tabIndex={onRightAddonClick ? 0 : undefined}
        onClick={onRightAddonClick}
        onKeyDown={onRightAddonClick ? handleEnterEvent(onRightAddonClick) : undefined}
      >
        {rightAddon}
      </div>
    );
  }

  function renderHint(): ReactNode {
    if (!hint) {
      return null;
    }

    return <div className={cn('hint', { size })}>{hint}</div>;
  }

  return (
    <div className={classnames(cn(), className)}>
      {renderLabel()}

      <div className={cn('inner', { focused, size, withRightAddon: Boolean(rightAddon), disabled })}>
        {renderInput()}
        {renderRightAddon()}
      </div>

      {renderHint()}
    </div>
  );
}

Input.defaultProps = {
  size: InputSize.M,
  value: '',
};
