import React, { ReactElement } from 'react';

import { ConnectionFormikField } from 'stores';

import { FormikField } from 'components/formik-field';
import { Checkbox, CheckboxSize } from 'components/checkbox';
import { Input } from 'components/input';
import { PasswordInput, InputSize, InputWidth } from 'components/password-input';

export function AuthenticationForm(): ReactElement {
  return (
    <div>
      <FormikField
        name={ConnectionFormikField.PerformAuth}
        component={Checkbox}
        componentProps={{
          label: 'Perform authentication',
          size: CheckboxSize.S,
        }}
      />

      <FormikField
        name={ConnectionFormikField.Username}
        component={Input}
        componentProps={{
          label: 'User Name',
          size: InputSize.S,
          width: InputWidth.Available,
        }}
      />

      <FormikField
        name={ConnectionFormikField.Password}
        component={PasswordInput}
        componentProps={{
          label: 'Password',
          size: InputSize.S,
          width: InputWidth.Available,
        }}
      />
    </div>
  );
}
