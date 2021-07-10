import React, { ReactElement } from 'react';

import { useStyles } from 'lib/theme';

import { ConnectionFormikField, ConnectionAdvancedFormikField } from 'stores';

import { FormikField } from 'components/formik-field';
import { Input, InputSize, InputWidth } from 'components/input';

import styles from './advanced-form.pcss';

function getFieldName(field: ConnectionAdvancedFormikField): string {
  return `${ConnectionFormikField.Advanced}.${field}`;
}

export function AdvancedForm(): ReactElement {
  const cn = useStyles(styles, 'advanced-form');

  return (
    <div>
      <FormikField
        name={getFieldName(ConnectionAdvancedFormikField.Family)}
        component={Input}
        componentProps={{
          label: 'Version of IP stack',
          size: InputSize.S,
          width: InputWidth.Available,
          className: cn('item'),
        }}
      />

      <FormikField
        name={getFieldName(ConnectionAdvancedFormikField.Db)}
        component={Input}
        componentProps={{
          label: 'Database Index',
        }}
      />
    </div>
  );
}
