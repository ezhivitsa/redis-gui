import React, { ReactElement, ReactNode } from 'react';
import { useField, FieldInputProps, FieldMetaProps, FieldHelperProps } from 'formik';

import { ConnectionType } from 'lib/db';
import { useStyles } from 'lib/theme';

import { FormikField } from 'ui/formik-field';
import { Checkbox, CheckboxSize, CheckboxWidth } from 'ui/checkbox';
import { Input } from 'ui/input';
import { PasswordInput, InputSize, InputWidth } from 'ui/password-input';

import {
  ConnectionFormikField,
  ConnectionAuthFormikField,
  ConnectionAuthFormikValues,
  ConnectionMainFormikField,
} from 'scenes/connection-modal/types';

import { useMainField } from '../main-form';

import styles from './authentication-form.pcss';

interface Props {
  isSaving: boolean;
}

function getFieldName(field: ConnectionAuthFormikField): string {
  return `${ConnectionFormikField.Auth}.${field}`;
}

function useAuthField<Field extends ConnectionAuthFormikField>(
  field: Field,
): [
  FieldInputProps<ConnectionAuthFormikValues[Field]>,
  FieldMetaProps<ConnectionAuthFormikValues[Field]>,
  FieldHelperProps<ConnectionAuthFormikValues[Field]>,
] {
  return useField<ConnectionAuthFormikValues[Field]>(getFieldName(field));
}

export function AuthenticationForm({ isSaving }: Props): ReactElement {
  const cn = useStyles(styles, 'authentication-form');

  const [typeField] = useMainField(ConnectionMainFormikField.Type);
  const [performAuthField] = useAuthField(ConnectionAuthFormikField.PerformAuth);

  const disabled = !performAuthField.value || isSaving;

  function renderSentinelFields(): ReactNode {
    if (typeField.value !== ConnectionType.Sentinel) {
      return null;
    }

    return (
      <>
        <FormikField
          name={getFieldName(ConnectionAuthFormikField.SentinelPassword)}
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

        <FormikField
          name={getFieldName(ConnectionAuthFormikField.SentinelUsername)}
          component={Input}
          componentProps={{
            label: 'Sentinel Username',
            size: InputSize.S,
            width: InputWidth.Available,
            hint: 'Username for Sentinel instances',
            className: cn('item'),
            disabled,
          }}
        />
      </>
    );
  }

  return (
    <div>
      <FormikField
        name={getFieldName(ConnectionAuthFormikField.PerformAuth)}
        component={Checkbox}
        componentProps={{
          label: 'Perform authentication',
          size: CheckboxSize.S,
          width: CheckboxWidth.Available,
          className: cn('item'),
          disabled: isSaving,
        }}
      />

      <FormikField
        name={getFieldName(ConnectionAuthFormikField.Username)}
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
        name={getFieldName(ConnectionAuthFormikField.Password)}
        component={PasswordInput}
        componentProps={{
          label: 'Password',
          size: InputSize.S,
          width: InputWidth.Available,
          className: cn('item'),
          disabled,
        }}
      />

      {renderSentinelFields()}
    </div>
  );
}
