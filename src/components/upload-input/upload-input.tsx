import React, { ReactElement, ReactNode, useState, useEffect, useRef, ChangeEvent } from 'react';
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

import { useStyles } from 'lib/theme';

import { InputSize } from 'components/input';

import styles from './upload-input.pcss';

interface UploadValue {
  name: string;
  text?: string;
}

interface Props {
  className?: string;
  label?: string;
  size?: InputSize;
  placeholder?: string;
  value?: UploadValue;
  id?: string;
  onChange?: (value: UploadValue, event: ChangeEvent<HTMLInputElement>) => void;
}

export function UploadInput({ className, label, size, placeholder, value, onChange, ...props }: Props): ReactElement {
  const cn = useStyles(styles, 'upload-input');

  const [id, setId] = useState(props.id);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) {
      setId(uuidv4());
    }
  }, [id]);

  function handleUpload(event: ChangeEvent<HTMLInputElement>): void {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const name = file.name;

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function () {
      onChange?.({ name, text: reader.result?.toString() }, event);
    };
  }

  function handleButtonClick(): void {
    inputRef.current?.click();
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

  function renderName(): ReactNode {
    if (value) {
      return <div className={cn('name')}>{value.name}</div>;
    }

    return <div className={cn('placeholder')}>{placeholder}</div>;
  }

  function renderButton(): ReactNode {
    return <button onClick={handleButtonClick}>...</button>;
  }

  return (
    <div className={classnames(cn(), className)}>
      {renderLabel}
      <div className={cn('inner')}>
        {renderName()}
        {renderButton()}
        <input type="file" id={id} ref={inputRef} className={cn('input')} onChange={handleUpload} />
      </div>
    </div>
  );
}

UploadInput.defaultProps = {
  size: InputSize.M,
};
