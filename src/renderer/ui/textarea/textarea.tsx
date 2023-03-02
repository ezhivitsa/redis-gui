import React, { ReactElement, ReactNode, ChangeEvent, FocusEvent, useState } from 'react';
import classnames from 'classnames';

import { useStyles } from 'renderer/lib/theme';

import { useIdHook } from 'renderer/hooks';

import styles from './textarea.pcss';

export enum TextareaSize {
  S = 's',
  M = 'm',
}

export enum TextareaWidth {
  Default = 'default',
  Available = 'available',
}

interface Props {
  value?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: FocusEvent<HTMLTextAreaElement>) => void;
  className?: string;
  label?: string;
  size?: TextareaSize;
  id?: string;
  width?: TextareaWidth;
  resizable?: boolean;
  disabled?: boolean;
  maxHeight?: boolean;
}

export function Textarea({
  className,
  value,
  label,
  size,
  width,
  disabled,
  maxHeight,
  onChange,
  onBlur,
  ...props
}: Props): ReactElement {
  const cn = useStyles(styles, 'textarea');
  const id = useIdHook(props.id);
  const [focused, setFocused] = useState(false);

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    const value = event.target.value;
    onChange?.(value, event);
  }

  function handleFocus(): void {
    setFocused(true);
  }

  function handleBlur(event: FocusEvent<HTMLTextAreaElement>): void {
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

  function renderTextarea(): ReactNode {
    return (
      <textarea
        id={id}
        value={value}
        className={cn('textarea', { size, width, maxHeight })}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
  }

  return (
    <div className={classnames(cn({ maxHeight }), className)}>
      {renderLabel()}
      <div className={cn('inner', { size, focused, disabled, maxHeight })}>{renderTextarea()}</div>
    </div>
  );
}

Textarea.defaultProps = {
  size: TextareaSize.M,
  width: TextareaWidth.Default,
};
