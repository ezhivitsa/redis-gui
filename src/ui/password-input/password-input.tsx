import React, { ReactElement, FocusEvent, ChangeEvent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';

import { Input, InputProps, InputType, InputSize } from 'ui/input';

type Props = Omit<InputProps, 'rightAddon' | 'onRightAddonClick' | 'type'>;

const mapSizeToIconSize: Record<InputSize, SizeProp> = {
  [InputSize.S]: 'xs',
  [InputSize.M]: 'sm',
};

export function PasswordInput({ value, onBlur, onFocus, onChange, ...props }: Props): ReactElement {
  const [type, setType] = useState<InputType>('password');
  const [hasInitialValue, setHasInitialValue] = useState<boolean>(Boolean(value));
  const [hideValue, setHideValue] = useState(false);

  const isPasswordType = type === 'password';

  function handleToggleType(): void {
    if (isPasswordType) {
      setType('text');
    } else {
      setType('password');
    }
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>): void {
    if (hasInitialValue) {
      setHideValue(true);
    }

    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>): void {
    if (hideValue) {
      setHideValue(false);
    }

    onBlur?.(event);
  }

  function handleChange(newValue: string, event: ChangeEvent<HTMLInputElement>): void {
    if (hasInitialValue) {
      setHasInitialValue(false);
    }

    if (hideValue) {
      setHideValue(false);
    }

    onChange?.(newValue, event);
  }

  return (
    <Input
      {...props}
      value={hideValue ? '' : value}
      type={type}
      rightAddon={
        !hasInitialValue && (
          <FontAwesomeIcon
            icon={isPasswordType ? faEyeSlash : faEye}
            size={props.size && mapSizeToIconSize[props.size]}
          />
        )
      }
      onRightAddonClick={handleToggleType}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
}

PasswordInput.defaultProps = {
  size: InputSize.M,
};
