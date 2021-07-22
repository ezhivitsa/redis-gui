import React, { ReactElement, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';

import { Input, InputProps, InputType, InputSize } from 'ui/input';

type Props = Omit<InputProps, 'rightAddon' | 'onRightAddonClick' | 'type'>;

const mapSizeToIconSize: Record<InputSize, SizeProp> = {
  [InputSize.S]: 'xs',
  [InputSize.M]: 'sm',
};

export function PasswordInput(props: Props): ReactElement {
  const [type, setType] = useState<InputType>('password');
  const isPasswordType = type === 'password';

  function handleToggleType(): void {
    if (isPasswordType) {
      setType('text');
    } else {
      setType('password');
    }
  }

  return (
    <Input
      {...props}
      type={type}
      rightAddon={
        <FontAwesomeIcon
          icon={isPasswordType ? faEyeSlash : faEye}
          size={props.size && mapSizeToIconSize[props.size]}
        />
      }
      onRightAddonClick={handleToggleType}
    />
  );
}

PasswordInput.defaultProps = {
  size: InputSize.M,
};
