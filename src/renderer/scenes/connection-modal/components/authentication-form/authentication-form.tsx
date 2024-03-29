import { FieldHelperProps, FieldInputProps, FieldMetaProps, useField } from 'formik';
import { ReactElement, ReactNode } from 'react';

import { ConnectionType } from 'data';

import { useStyles } from 'renderer/lib/theme';

import { Checkbox, CheckboxSize, CheckboxWidth } from 'renderer/ui/checkbox';
import { FormikField } from 'renderer/ui/formik-field';
import { Input } from 'renderer/ui/input';
import { InputSize, InputWidth, PasswordInput } from 'renderer/ui/password-input';

import {
  ConnectionAuthFormikField,
  ConnectionAuthFormikValues,
  ConnectionFormikField,
  ConnectionMainFormikField,
} from 'renderer/scenes/connection-modal/types';

import { authenticationFormTexts } from 'texts';

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
            label: authenticationFormTexts.sentinelPasswordLabel,
            size: InputSize.S,
            width: InputWidth.Available,
            hint: authenticationFormTexts.sentinelPasswordHint,
            className: cn('item'),
            disabled,
          }}
        />

        <FormikField
          name={getFieldName(ConnectionAuthFormikField.SentinelUsername)}
          component={Input}
          componentProps={{
            label: authenticationFormTexts.sentinelUsernameHint,
            size: InputSize.S,
            width: InputWidth.Available,
            hint: authenticationFormTexts.sentinelUsernameLabel,
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
          label: authenticationFormTexts.performAuthLabel,
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
          label: authenticationFormTexts.usernameLabel,
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
          label: authenticationFormTexts.passwordLabel,
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
