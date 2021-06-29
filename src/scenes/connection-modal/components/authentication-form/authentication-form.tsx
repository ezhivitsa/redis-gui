import React, { ReactElement, ReactNode } from 'react';
import { useField } from 'formik';

import { ConnectionType } from 'lib/db';
import { useStyles } from 'lib/theme';

import { ConnectionFormikField, ConnectionFormikValues } from 'stores';

import { FormikField } from 'components/formik-field';
import { Checkbox, CheckboxSize, CheckboxWidth } from 'components/checkbox';
import { Input } from 'components/input';
import { PasswordInput, InputSize, InputWidth } from 'components/password-input';

import styles from './authentication-form.pcss';

export function AuthenticationForm(): ReactElement {
  const cn = useStyles(styles, 'authentication-form');

  const [typeField] = useField<ConnectionFormikValues[ConnectionFormikField.Type]>(ConnectionFormikField.Type);
  const [performAuthField] = useField<ConnectionFormikValues[ConnectionFormikField.PerformAuth]>(
    ConnectionFormikField.PerformAuth,
  );

  const disabled = !performAuthField.value;

  function renderSentinelPassword(): ReactNode {
    if (typeField.value !== ConnectionType.Sentinel) {
      return null;
    }

    return (
      <FormikField
        name={ConnectionFormikField.SentinelPassword}
        component={PasswordInput}
        componentProps={{
          label: 'Sentinel Password',
          size: InputSize.S,
          width: InputWidth.Available,
          hint: 'Password for Sentinel instances',
          className: cn('item'),
          disabled,
        }}
      />
    );
  }

  return (
    <div>
      <FormikField
        name={ConnectionFormikField.PerformAuth}
        component={Checkbox}
        componentProps={{
          label: 'Perform authentication',
          size: CheckboxSize.S,
          width: CheckboxWidth.Available,
          className: cn('item'),
        }}
      />

      <FormikField
        name={ConnectionFormikField.Username}
        component={Input}
        componentProps={{
          label: 'User Name',
          size: InputSize.S,
          width: InputWidth.Available,
          className: cn('item'),
          disabled,
        }}
      />

      <FormikField
        name={ConnectionFormikField.Password}
        component={PasswordInput}
        componentProps={{
          label: 'Password',
          size: InputSize.S,
          width: InputWidth.Available,
          className: cn('item'),
          disabled,
        }}
      />

      {renderSentinelPassword()}
    </div>
  );
}
