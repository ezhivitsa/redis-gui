import React, { ReactElement } from 'react';

import { useStyles } from 'lib/theme';

import { ConnectionFormikField, ConnectionAdvancedFormikField } from 'scenes/connection-modal/types';

import { FormikField } from 'components/formik-field';
import { Input, InputSize, InputWidth } from 'components/input';
import { NumberInput } from 'components/number-input';
import { Checkbox, CheckboxSize, CheckboxWidth } from 'components/checkbox';

import styles from './advanced-form.pcss';

interface Props {
  isSaving: boolean;
}

function getFieldName(field: ConnectionAdvancedFormikField): string {
  return `${ConnectionFormikField.Advanced}.${field}`;
}

export function AdvancedForm({ isSaving }: Props): ReactElement {
  const cn = useStyles(styles, 'advanced-form');

  return (
    <div>
      <FormikField
        name={getFieldName(ConnectionAdvancedFormikField.Family)}
        component={NumberInput}
        componentProps={{
          label: 'Version of IP stack',
          minValue: 0,
          size: InputSize.S,
          width: InputWidth.Available,
          className: cn('item'),
          disabled: isSaving,
        }}
      />

      <FormikField
        name={getFieldName(ConnectionAdvancedFormikField.Db)}
        component={NumberInput}
        componentProps={{
          label: 'Database Index',
          minValue: 0,
          size: InputSize.S,
          width: InputWidth.Available,
          className: cn('item'),
          disabled: isSaving,
        }}
      />

      <FormikField
        name={getFieldName(ConnectionAdvancedFormikField.KeyPrefix)}
        component={Input}
        componentProps={{
          label: 'The prefix to prepend to all keys in a command',
          size: InputSize.S,
          width: InputWidth.Available,
          className: cn('item'),
          disabled: isSaving,
        }}
      />

      <FormikField
        name={getFieldName(ConnectionAdvancedFormikField.StringNumbers)}
        component={Checkbox}
        componentProps={{
          label: 'Force numbers to be returned as strings',
          size: CheckboxSize.S,
          width: CheckboxWidth.Available,
          className: cn('item'),
          disabled: isSaving,
        }}
      />
    </div>
  );
}
