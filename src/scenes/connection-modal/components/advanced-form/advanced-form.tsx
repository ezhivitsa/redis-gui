import React, { ReactElement } from 'react';

import { useStyles } from 'lib/theme';

import { FormikField } from 'ui/formik-field';
import { Input, InputSize, InputWidth } from 'ui/input';
import { NumberInput } from 'ui/number-input';
import { Checkbox, CheckboxSize, CheckboxWidth } from 'ui/checkbox';

import { advancedFormTexts } from 'texts';

import { ConnectionFormikField, ConnectionAdvancedFormikField } from 'scenes/connection-modal/types';

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
          label: advancedFormTexts.familyLabel,
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
          label: advancedFormTexts.dbLabel,
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
          label: advancedFormTexts.keyPrefixLabel,
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
          label: advancedFormTexts.stringNumbersLabel,
          size: CheckboxSize.S,
          width: CheckboxWidth.Available,
          className: cn('item'),
          disabled: isSaving,
        }}
      />
    </div>
  );
}
