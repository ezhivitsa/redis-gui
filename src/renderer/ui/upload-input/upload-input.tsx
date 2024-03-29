import classnames from 'classnames';
import { ChangeEvent, ReactElement, ReactNode, useRef } from 'react';

import { handleEnterEvent } from 'renderer/lib/keyboard';
import { useStyles } from 'renderer/lib/theme';

import { useIdHook } from 'renderer/hooks';

import { InputSize } from 'renderer/ui/input';

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
  disabled?: boolean;
  onChange?: (value: UploadValue, event: ChangeEvent<HTMLInputElement>) => void;
}

export function UploadInput({
  className,
  label,
  size,
  placeholder,
  value,
  disabled,
  onChange,
  ...props
}: Props): ReactElement {
  const cn = useStyles(styles, 'upload-input');

  const id = useIdHook(props.id);
  const inputRef = useRef<HTMLInputElement>(null);

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
      return (
        <div className={cn('name-wrap')}>
          <div className={cn('name', { size, disabled })}>{value.name}</div>
        </div>
      );
    }

    return (
      <div
        className={cn('name-wrap', { disabled })}
        onClick={handleButtonClick}
        onKeyDown={handleEnterEvent(handleButtonClick)}
        tabIndex={0}
        role="button"
      >
        <div className={cn('name', { size, placeholder: true })}>{placeholder}</div>
      </div>
    );
  }

  function renderButton(): ReactNode {
    return (
      <button onClick={handleButtonClick} className={cn('btn', { size, disabled })}>
        ...
      </button>
    );
  }

  return (
    <div className={classnames(cn(), className)}>
      {renderLabel()}

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
