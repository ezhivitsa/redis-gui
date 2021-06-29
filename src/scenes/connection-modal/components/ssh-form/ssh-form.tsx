import React, { ReactElement } from 'react';

import { useStyles } from 'lib/theme';

import { ConnectionFormikField, ConnectionSShFormikField } from 'stores';

import { Checkbox, CheckboxSize, CheckboxWidth } from 'components/checkbox';
import { FormikField } from 'components/formik-field';

import styles from './ssh-form.pcss';

export function SshForm(): ReactElement {
  const cn = useStyles(styles, 'ssh-form');

  return (
    <div>
      <FormikField
        name={`${ConnectionFormikField.Ssh}${ConnectionSShFormikField.Enabled}`}
        component={Checkbox}
        componentProps={{
          label: 'Use SSH tunnel',
          size: CheckboxSize.S,
          width: CheckboxWidth.Available,
          className: cn('item'),
        }}
      />
    </div>
  );
}
