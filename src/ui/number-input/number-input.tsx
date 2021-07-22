import React, { ReactElement, ChangeEvent, useState } from 'react';

import { parseNumber } from 'lib/numbers';

import { Input, InputProps } from 'ui/input';

interface Props extends Omit<InputProps, 'value' | 'onChange'> {
  step?: number;
  minValue?: number;
  maxValue?: number;
  value?: number;
  onChange?: (value: number | undefined, event: ChangeEvent<HTMLInputElement>) => void;
}

export function NumberInput({ step, minValue, maxValue, value, onChange, ...props }: Props): ReactElement {
  const [localValue, setLocalValue] = useState<string>(value !== undefined ? value.toString() : '');

  function isInInterval(val: number): boolean {
    return (minValue === undefined || minValue <= val) && (maxValue === undefined || maxValue >= val);
  }

  function handleChange(value: string, event: ChangeEvent<HTMLInputElement>): void {
    if (value === '') {
      setLocalValue(value);
      onChange?.(undefined, event);
      return;
    }

    let num = parseNumber(value);
    if (value === '-' && (!minValue || minValue < 0)) {
      num = 0;
    }

    if (Number.isNaN(num) || !isInInterval(num)) {
      return;
    }

    setLocalValue(value);
    onChange?.(num, event);
  }

  return (
    <Input
      {...props}
      type="number"
      step={step}
      value={localValue}
      onChange={handleChange}
      min={minValue}
      max={maxValue}
    />
  );
}
