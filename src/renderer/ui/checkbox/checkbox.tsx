import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { ChangeEvent, FocusEvent, ReactElement, ReactNode } from 'react';

import { useStyles } from 'renderer/lib/theme';

import { useIdHook } from 'renderer/hooks';

import styles from './checkbox.pcss';

export enum CheckboxSize {
  S = 's',
  M = 'm',
}

export enum CheckboxWidth {
  Default = 'default',
  Available = 'available',
}

interface Props {
  id?: string;
  className?: string;
  size?: CheckboxSize;
  width?: CheckboxWidth;
  value?: boolean;
  label?: ReactNode;
  disabled?: boolean;
  onChange?: (value: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent) => void;
}

const mapSizeToIconSize: Record<CheckboxSize, SizeProp> = {
  [CheckboxSize.S]: 'xs',
  [CheckboxSize.M]: 'sm',
};

export function Checkbox({
  disabled,
  className,
  size,
  width,
  value,
  label,
  onChange,
  onBlur,
  ...props
}: Props): ReactElement {
  const cn = useStyles(styles, 'checkbox');
  const id = useIdHook(props.id);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    if (!disabled) {
      onChange?.(event.target.checked, event);
    }
  }

  function renderLabel(): ReactNode {
    if (!label) {
      return null;
    }

    return <div className={cn('label', { size, width })}>{label}</div>;
  }

  return (
    <div className={classnames(cn({ size, width }), className)}>
      <input id={id} className={cn('input')} type="checkbox" checked={value} onChange={handleChange} onBlur={onBlur} />

      <label className={cn('inner', { disabled, width })} htmlFor={id}>
        <span className={cn('check', { size, checked: value, disabled })}>
          {value && <FontAwesomeIcon icon={faCheck} size={size && mapSizeToIconSize[size]} />}
        </span>

        {renderLabel()}
      </label>
    </div>
  );
}

Checkbox.defaultProps = {
  size: CheckboxSize.M,
  width: CheckboxWidth.Default,
  value: false,
};
