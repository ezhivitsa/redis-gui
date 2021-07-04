import React, { ReactElement, ReactNode } from 'react';
import { useField } from 'formik';
import classnames from 'classnames';

import { useStyles } from 'lib/theme';
import { SshAuthMethod } from 'lib/db';

import { ConnectionFormikField, ConnectionSShFormikField, ConnectionSShFormikValues } from 'stores';

import { Checkbox, CheckboxSize, CheckboxWidth } from 'components/checkbox';
import { Input, InputSize, InputWidth } from 'components/input';
import { Select, SelectSize, SelectWidth } from 'components/select';
import { UploadInput } from 'components/upload-input';
import { FormikField } from 'components/formik-field';

import styles from './ssh-form.pcss';

export function SshForm(): ReactElement {
  const cn = useStyles(styles, 'ssh-form');

  const [authMethodField] = useField<ConnectionSShFormikValues[ConnectionSShFormikField.AuthMethod]>(
    `${ConnectionFormikField.Ssh}.${ConnectionSShFormikField.AuthMethod}`,
  );

  function renderPrivateKey(): ReactNode {
    if (authMethodField.value !== SshAuthMethod.PrivateKey) {
      return null;
    }

    return (
      <FormikField
        name={`${ConnectionFormikField.Ssh}.${ConnectionSShFormikField.PrivateKey}`}
        component={UploadInput}
        componentProps={{
          label: 'Private key',
          size: InputSize.S,
          className: cn('item'),
          placeholder: 'DSA, RSA, and/or Windows/macOS ECDSA, Ed25519 keys',
        }}
      />
    );
  }

  return (
    <div>
      <FormikField
        name={`${ConnectionFormikField.Ssh}.${ConnectionSShFormikField.Enabled}`}
        component={Checkbox}
        componentProps={{
          label: 'Use SSH tunnel',
          size: CheckboxSize.S,
          width: CheckboxWidth.Available,
          className: cn('item'),
        }}
      />

      <div className={classnames(cn('address-item'), cn('item'))}>
        <FormikField
          name={`${ConnectionFormikField.Ssh}.${ConnectionSShFormikField.Host}`}
          component={Input}
          componentProps={{
            label: 'Address Host',
            size: InputSize.S,
            width: InputWidth.Available,
            className: cn('host'),
          }}
        />

        <FormikField
          name={`${ConnectionFormikField.Ssh}.${ConnectionSShFormikField.Port}`}
          component={Input}
          componentProps={{
            label: 'Port',
            size: InputSize.S,
            width: InputWidth.Available,
            className: cn('port'),
          }}
        />
      </div>

      <FormikField
        name={`${ConnectionFormikField.Ssh}.${ConnectionSShFormikField.AuthMethod}`}
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
          className: cn('item'),
        }}
      />

      {renderPrivateKey()}
    </div>
  );
}
