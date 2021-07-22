import React, { ReactElement, ReactNode } from 'react';
import { useField, FieldInputProps, FieldMetaProps, FieldHelperProps } from 'formik';

import { useStyles } from 'lib/theme';
import { AuthenticationMethod, InvalidHostnames } from 'lib/db';

import { Checkbox, CheckboxSize, CheckboxWidth } from 'ui/checkbox';
import { Select, SelectSize, SelectWidth } from 'ui/select';
import { UploadInput } from 'ui/upload-input';
import { InputSize, InputWidth } from 'ui/input';
import { PasswordInput } from 'ui/password-input';
import { FormikField } from 'ui/formik-field';

import {
  ConnectionFormikField,
  ConnectionTlsFormikField,
  ConnectionTlsFormikValues,
} from 'scenes/connection-modal/types';

import styles from './tls-form.pcss';

interface Props {
  isSaving: boolean;
}

function getFieldName(field: ConnectionTlsFormikField): string {
  return `${ConnectionFormikField.Tls}.${field}`;
}

function useTlsField<Field extends ConnectionTlsFormikField>(
  field: Field,
): [
  FieldInputProps<ConnectionTlsFormikValues[Field]>,
  FieldMetaProps<ConnectionTlsFormikValues[Field]>,
  FieldHelperProps<ConnectionTlsFormikValues[Field]>,
] {
  return useField<ConnectionTlsFormikValues[Field]>(getFieldName(field));
}

export function TlsForm({ isSaving }: Props): ReactElement {
  const cn = useStyles(styles, 'tls-form');

  const [enabledField] = useTlsField(ConnectionTlsFormikField.Enabled);
  const [authenticationMethodField] = useTlsField(ConnectionTlsFormikField.AuthenticationMethod);
  const [, , caCertificateHelper] = useTlsField(ConnectionTlsFormikField.CaCertificate);

  const [usePemField] = useTlsField(ConnectionTlsFormikField.UsePem);
  const [, , pemHelper] = useTlsField(ConnectionTlsFormikField.Pem);
  const [, , passphraseHelper] = useTlsField(ConnectionTlsFormikField.Passphrase);
  const [, , askForPassphraseHelper] = useTlsField(ConnectionTlsFormikField.AskForPassphraseEachTime);

  const [advancedOptionsField] = useTlsField(ConnectionTlsFormikField.AdvancedOptions);
  const [, , crlHelper] = useTlsField(ConnectionTlsFormikField.Crl);
  const [, , invalidHostnamesHelper] = useTlsField(ConnectionTlsFormikField.InvalidHostnames);

  const disabled = !enabledField.value || isSaving;

  function handleAuthenticationMethodChange(): void {
    caCertificateHelper.setValue(undefined);
  }

  function handleUsePemChange(): void {
    pemHelper.setValue(undefined);
    passphraseHelper.setValue('');
    askForPassphraseHelper.setValue(false);
  }

  function handleAdvancedOptionsChange(): void {
    crlHelper.setValue(undefined);
    invalidHostnamesHelper.setValue(InvalidHostnames.NotAllowed);
  }

  function renderCaCertificateFields(): ReactNode {
    if (authenticationMethodField.value !== AuthenticationMethod.CaCertificate) {
      return null;
    }

    return (
      <FormikField
        name={getFieldName(ConnectionTlsFormikField.CaCertificate)}
        component={UploadInput}
        componentProps={{
          label: 'CA Certificate',
          size: InputSize.S,
          className: cn('item'),
          disabled,
        }}
      />
    );
  }

  function renderPemFields(): ReactNode {
    if (!usePemField.value) {
      return null;
    }

    return (
      <>
        <FormikField
          name={getFieldName(ConnectionTlsFormikField.Pem)}
          component={UploadInput}
          componentProps={{
            label: 'PEM Certificate/Key',
            size: InputSize.S,
            className: cn('item'),
            disabled,
          }}
        />

        <FormikField
          name={getFieldName(ConnectionTlsFormikField.Passphrase)}
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
          name={`${ConnectionFormikField.Tls}.${ConnectionTlsFormikField.AskForPassphraseEachTime}`}
          component={Checkbox}
          componentProps={{
            label: 'Ask for passphrase each time',
            size: CheckboxSize.S,
            width: CheckboxWidth.Available,
            className: cn('item'),
            disabled,
          }}
        />
      </>
    );
  }

  function renderAdvancedOptionsFields(): ReactNode {
    if (!advancedOptionsField.value) {
      return null;
    }

    return (
      <>
        <FormikField
          name={getFieldName(ConnectionTlsFormikField.Crl)}
          component={UploadInput}
          componentProps={{
            label: 'CRL (Revocation List)',
            size: InputSize.S,
            className: cn('item'),
            disabled,
          }}
        />

        <FormikField
          name={getFieldName(ConnectionTlsFormikField.InvalidHostnames)}
          component={Select}
          componentProps={{
            label: 'Invalid Hostnames',
            size: SelectSize.S,
            width: SelectWidth.Available,
            items: [
              {
                value: InvalidHostnames.NotAllowed,
                text: 'Not Allowed',
              },
              {
                value: InvalidHostnames.Allowed,
                text: 'Allowed',
              },
            ],
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
        name={getFieldName(ConnectionTlsFormikField.Enabled)}
        component={Checkbox}
        componentProps={{
          label: 'Use TLS protocol',
          size: CheckboxSize.S,
          width: CheckboxWidth.Available,
          className: cn('item'),
          disabled: isSaving,
        }}
      />

      <FormikField
        name={getFieldName(ConnectionTlsFormikField.AuthenticationMethod)}
        component={Select}
        componentProps={{
          label: 'Authentication Method',
          size: SelectSize.S,
          width: SelectWidth.Available,
          items: [
            {
              value: AuthenticationMethod.SelfSigned,
              text: 'Self-signed Certificate',
            },
            {
              value: AuthenticationMethod.CaCertificate,
              text: 'CA Certificate',
            },
          ],
          onChange: handleAuthenticationMethodChange,
          className: cn('item'),
          disabled,
        }}
      />

      {renderCaCertificateFields()}

      <FormikField
        name={getFieldName(ConnectionTlsFormikField.UsePem)}
        component={Checkbox}
        componentProps={{
          label: 'Use PEM Cert./Key',
          size: CheckboxSize.S,
          width: CheckboxWidth.Available,
          onChange: handleUsePemChange,
          className: cn('item'),
          disabled,
        }}
      />

      {renderPemFields()}

      <FormikField
        name={getFieldName(ConnectionTlsFormikField.AdvancedOptions)}
        component={Checkbox}
        componentProps={{
          label: 'Advanced Options',
          size: CheckboxSize.S,
          width: CheckboxWidth.Available,
          onChange: handleAdvancedOptionsChange,
          className: cn('item'),
          disabled,
        }}
      />

      {renderAdvancedOptionsFields()}
    </div>
  );
}
