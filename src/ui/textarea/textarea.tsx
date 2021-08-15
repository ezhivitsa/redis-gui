import React, { ReactElement, ReactNode, ChangeEvent } from 'react';
import classnames from 'classnames';

import { useStyles } from 'lib/theme';

import { useIdHook } from 'hooks';

import styles from './textarea.pcss';

export enum TextareaSize {
  S = 's',
  M = 'm',
}

interface Props {
  value?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  label?: string;
  size?: TextareaSize;
  id?: string;
}

export function Textarea({ className, value, label, size, onChange, ...props }: Props): ReactElement {
  const cn = useStyles(styles, 'textarea');
  const id = useIdHook(props.id);

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    const value = event.target.value;
    onChange?.(value, event);
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
    return <textarea id={id} value={value} onChange={handleChange} />;
  }

  return (
    <div className={classnames(cn(), className)}>
      {renderLabel()}
      {renderTextarea()}
    </div>
  );
}
