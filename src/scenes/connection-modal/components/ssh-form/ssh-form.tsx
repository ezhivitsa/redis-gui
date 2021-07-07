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
import { PasswordInput } from 'components/password-input';
import { FormikField } from 'components/formik-field';

import styles from './ssh-form.pcss';

export function SshForm(): ReactElement {
  const cn = useStyles(styles, 'ssh-form');

  const [enabledField] = useField<ConnectionSShFormikValues[ConnectionSShFormikField.Enabled]>(
    `${ConnectionFormikField.Ssh}.${ConnectionSShFormikField.Enabled}`,
  );
  const [authMethodField] = useField<ConnectionSShFormikValues[ConnectionSShFormikField.AuthMethod]>(
    `${ConnectionFormikField.Ssh}.${ConnectionSShFormikField.AuthMethod}`,
  );

  const [, , privateKeyHelper] = useField<ConnectionSShFormikValues[ConnectionSShFormikField.PrivateKey]>(
    `${ConnectionFormikField.Ssh}.${ConnectionSShFormikField.PrivateKey}`,
  );
  const [, , passphraseHelper] = useField<ConnectionSShFormikValues[ConnectionSShFormikField.Passphrase]>(
    `${ConnectionFormikField.Ssh}.${ConnectionSShFormikField.Passphrase}`,
  );
  const [, , askForPassphraseEachTimeHelper] = useField<
    ConnectionSShFormikValues[ConnectionSShFormikField.AskForPassphraseEachTime]
  >(`${ConnectionFormikField.Ssh}.${ConnectionSShFormikField.AskForPassphraseEachTime}`);
  const [, , passwordHelper] = useField<ConnectionSShFormikValues[ConnectionSShFormikField.Password]>(
    `${ConnectionFormikField.Ssh}.${ConnectionSShFormikField.Password}`,
  );
  const [, , askForPasswordEachTimeHelper] = useField<
    ConnectionSShFormikValues[ConnectionSShFormikField.AskForPasswordEachTime]
  >(`${ConnectionFormikField.Ssh}.${ConnectionSShFormikField.AskForPasswordEachTime}`);

  const disabled = !enabledField.value;

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
          name={`${ConnectionFormikField.Ssh}.${ConnectionSShFormikField.PrivateKey}`}
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
          name={`${ConnectionFormikField.Ssh}.${ConnectionSShFormikField.Passphrase}`}
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
          name={`${ConnectionFormikField.Ssh}.${ConnectionSShFormikField.AskForPassphraseEachTime}`}
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
          name={`${ConnectionFormikField.Ssh}.${ConnectionSShFormikField.Passphrase}`}
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
          name={`${ConnectionFormikField.Ssh}.${ConnectionSShFormikField.AskForPasswordEachTime}`}
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
            disabled,
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
            disabled,
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
          onChange: handleAuthMethodChange,
          disabled,
        }}
      />

      {renderPrivateKeyFields()}
      {renderPasswordFields()}
    </div>
  );
}
