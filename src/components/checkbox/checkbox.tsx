import React, { ReactElement, ReactNode, ChangeEvent, FocusEvent, useState, useEffect } from 'react';
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useStyles } from 'lib/theme';

import styles from './checkbox.pcss';

export enum CheckboxSize {
  S = 's',
  M = 'm',
}

interface Props {
  id?: string;
  className?: string;
  size?: CheckboxSize;
  value?: boolean;
  label?: ReactNode;
  onChange?: (value: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent) => void;
}

const mapSizeToIconSize: Record<CheckboxSize, SizeProp> = {
  [CheckboxSize.S]: 'xs',
  [CheckboxSize.M]: 'sm',
};

export function Checkbox({ className, size, value, label, onChange, onBlur, ...props }: Props): ReactElement {
  const cn = useStyles(styles, 'checkbox');

  const [id, setId] = useState(props.id);

  useEffect(() => {
    if (!id) {
      setId(uuidv4());
    }
  }, [id]);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    console.log(event.target.checked);
    onChange?.(event.target.checked, event);
  }

  function renderLabel(): ReactNode {
    if (!label) {
      return null;
    }

    return <div className={cn('label', { size })}>{label}</div>;
  }

  return (
    <div className={classnames(cn({ size }), className)}>
      <input id={id} className={cn('input')} type="checkbox" checked={value} onChange={handleChange} onBlur={onBlur} />

      <label className={cn('inner')} htmlFor={id}>
        <span className={cn('check', { size, checked: value })}>
          {value && <FontAwesomeIcon icon={faCheck} size={size && mapSizeToIconSize[size]} />}
        </span>

        {renderLabel()}
      </label>
    </div>
  );
}

Checkbox.defaultProps = {
  size: CheckboxSize.M,
  value: false,
};
