import React, { ReactElement } from 'react';

import { useStyles } from 'lib/theme';
import { SshAuthMethod } from 'lib/db';

import { ConnectionFormikField, ConnectionSShFormikField } from 'stores';

import { Checkbox, CheckboxSize, CheckboxWidth } from 'components/checkbox';
import { Input, InputSize, InputWidth } from 'components/input';
import { Select, SelectSize, SelectWidth } from 'components/select';
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

      <div>
        <FormikField
          name={`${ConnectionFormikField.Ssh}${ConnectionSShFormikField.Host}`}
          component={Input}
          componentProps={{
            label: 'Address Host',
            size: InputSize.S,
            width: InputWidth.Available,
          }}
        />

        <FormikField
          name={`${ConnectionFormikField.Ssh}${ConnectionSShFormikField.Port}`}
          component={Input}
          componentProps={{
            label: 'Port',
            size: InputSize.S,
            width: InputWidth.Available,
          }}
        />
      </div>

      <FormikField
        name={`${ConnectionFormikField.Ssh}${ConnectionSShFormikField.AuthMethod}`}
        component={Select}
        componentProps={{
          label: 'SSH Auth Method',
          items: [
            {
              value: SshAuthMethod.PrivateKey,
              text: 'Private Key',
            },
            {
              value: SshAuthMethod.Password,
              text: 'Password',
            },
          ],
          size: SelectSize.S,
          width: SelectWidth.Available,
        }}
      />
    </div>
  );
}
