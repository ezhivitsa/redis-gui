import React, { ReactElement, ReactNode } from 'react';
import { useField, FieldInputProps, FieldMetaProps, FieldHelperProps } from 'formik';
import classnames from 'classnames';

import { useStyles } from 'lib/theme';
import { SshAuthMethod } from 'lib/db';

import { Checkbox, CheckboxSize, CheckboxWidth } from 'ui/checkbox';
import { Input, InputSize, InputWidth } from 'ui/input';
import { Select, SelectSize, SelectWidth } from 'ui/select';
import { UploadInput } from 'ui/upload-input';
import { PasswordInput } from 'ui/password-input';
import { FormikField } from 'ui/formik-field';

import {
  ConnectionFormikField,
  ConnectionSShFormikField,
  ConnectionSShFormikValues,
} from 'scenes/connection-modal/types';

import styles from './ssh-form.pcss';

interface Props {
  isSaving: boolean;
}

function getFieldName(field: ConnectionSShFormikField): string {
  return `${ConnectionFormikField.Ssh}.${field}`;
}

function useSshField<Field extends ConnectionSShFormikField>(
  field: Field,
): [
  FieldInputProps<ConnectionSShFormikValues[Field]>,
  FieldMetaProps<ConnectionSShFormikValues[Field]>,
  FieldHelperProps<ConnectionSShFormikValues[Field]>,
] {
  return useField<ConnectionSShFormikValues[Field]>(getFieldName(field));
}

export function SshForm({ isSaving }: Props): ReactElement {
  const cn = useStyles(styles, 'ssh-form');

  const [enabledField] = useSshField(ConnectionSShFormikField.Enabled);
  const [authMethodField] = useSshField(ConnectionSShFormikField.AuthMethod);

  const [, , privateKeyHelper] = useSshField(ConnectionSShFormikField.PrivateKey);
  const [, , passphraseHelper] = useSshField(ConnectionSShFormikField.Passphrase);
  const [, , askForPassphraseEachTimeHelper] = useSshField(ConnectionSShFormikField.AskForPassphraseEachTime);
  const [, , passwordHelper] = useSshField(ConnectionSShFormikField.Password);
  const [, , askForPasswordEachTimeHelper] = useSshField(ConnectionSShFormikField.AskForPasswordEachTime);

  const disabled = !enabledField.value || isSaving;

  function handleAuthMethodChange(): void {
    privateKeyHelper.setValue(undefined);

    passphraseHelper.setValue('');
    passwordHelper.setValue('');

    askForPassphraseEachTimeHelper.setValue(false);
    askForPasswordEachTimeHelper.setValue(false);
  }

  function renderPrivateKeyFields(): ReactNode {
    if (authMethodField.value !== SshAuthMethod.PrivateKey) {
      return null;
    }

    return (
      <>
        <FormikField
          name={getFieldName(ConnectionSShFormikField.PrivateKey)}
          component={UploadInput}
          componentProps={{
            label: 'Private key',
            size: InputSize.S,
            className: cn('item'),
            placeholder: 'DSA, RSA, and/or Windows/macOS ECDSA, Ed25519 keys',
            disabled,
          }}
        />

        <FormikField
          name={getFieldName(ConnectionSShFormikField.Passphrase)}
          component={PasswordInput}
          componentProps={{
            label: 'Passphrase',
            size: InputSize.S,
            width: InputWidth.Available,
            className: cn('item'),
            disabled,
          }}
        />

        <FormikField
          name={getFieldName(ConnectionSShFormikField.AskForPassphraseEachTime)}
          component={Checkbox}
          componentProps={{
            label: 'Ask for passphrase each time',
            size: CheckboxSize.S,
            className: cn('item'),
            disabled,
          }}
        />
      </>
    );
  }

  function renderPasswordFields(): ReactNode {
    if (authMethodField.value !== SshAuthMethod.Password) {
      return null;
    }

    return (
      <>
        <FormikField
          name={getFieldName(ConnectionSShFormikField.Passphrase)}
          component={PasswordInput}
          componentProps={{
            label: 'Password',
            size: InputSize.S,
            width: InputWidth.Available,
            className: cn('item'),
            disabled,
          }}
        />

        <FormikField
          name={getFieldName(ConnectionSShFormikField.AskForPasswordEachTime)}
          component={Checkbox}
          componentProps={{
            label: 'Ask for password each time',
            size: CheckboxSize.S,
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
        name={getFieldName(ConnectionSShFormikField.Enabled)}
        component={Checkbox}
        componentProps={{
          label: 'Use SSH tunnel',
          size: CheckboxSize.S,
          width: CheckboxWidth.Available,
          className: cn('item'),
          disabled: isSaving,
        }}
      />

      <div className={classnames(cn('address-item'), cn('item'))}>
        <FormikField
          name={getFieldName(ConnectionSShFormikField.Host)}
          component={Input}
          componentProps={{
            label: 'Address Host',
            size: InputSize.S,
            width: InputWidth.Available,
            className: cn('host'),
            disabled,
          }}
        />

        <FormikField
          name={getFieldName(ConnectionSShFormikField.Port)}
          component={Input}
          componentProps={{
            label: 'Port',
            size: InputSize.S,
            width: InputWidth.Available,
            className: cn('port'),
            disabled,
          }}
        />
      </div>

      <FormikField
        name={getFieldName(ConnectionSShFormikField.AuthMethod)}
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
          onChange: handleAuthMethodChange,
          disabled,
        }}
      />

      {renderPrivateKeyFields()}
      {renderPasswordFields()}
    </div>
  );
}
