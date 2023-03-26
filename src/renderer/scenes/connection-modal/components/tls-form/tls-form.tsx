import { FieldHelperProps, FieldInputProps, FieldMetaProps, useField } from 'formik';
import { ReactElement, ReactNode } from 'react';

import { AuthenticationMethod, InvalidHostnames } from 'data';

import { useStyles } from 'renderer/lib/theme';

import { Checkbox, CheckboxSize, CheckboxWidth } from 'renderer/ui/checkbox';
import { FormikField } from 'renderer/ui/formik-field';
import { InputSize, InputWidth } from 'renderer/ui/input';
import { PasswordInput } from 'renderer/ui/password-input';
import { Select, SelectSize, SelectWidth } from 'renderer/ui/select';
import { UploadInput } from 'renderer/ui/upload-input';

import {
  ConnectionFormikField,
  ConnectionTlsFormikField,
  ConnectionTlsFormikValues,
} from 'renderer/scenes/connection-modal/types';

import { tlsFormTexts } from 'texts';

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
          label: tlsFormTexts.caCertificateLabel,
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
            label: tlsFormTexts.pemLabel,
            size: InputSize.S,
            className: cn('item'),
            disabled,
          }}
        />

        <FormikField
          name={getFieldName(ConnectionTlsFormikField.Passphrase)}
          component={PasswordInput}
          componentProps={{
            label: tlsFormTexts.passphraseLabel,
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
            label: tlsFormTexts.askPassphraseLabel,
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
            label: tlsFormTexts.crlLabel,
            size: InputSize.S,
            className: cn('item'),
            disabled,
          }}
        />

        <FormikField
          name={getFieldName(ConnectionTlsFormikField.InvalidHostnames)}
          component={Select}
          componentProps={{
            label: tlsFormTexts.hostnamesLabel,
            size: SelectSize.S,
            width: SelectWidth.Available,
            items: [
              {
                value: InvalidHostnames.NotAllowed,
                text: tlsFormTexts.notAllowed,
              },
              {
                value: InvalidHostnames.Allowed,
                text: tlsFormTexts.allowed,
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
          label: tlsFormTexts.enabledLabel,
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
          label: tlsFormTexts.enabledLabel,
          size: SelectSize.S,
          width: SelectWidth.Available,
          items: [
            {
              value: AuthenticationMethod.SelfSigned,
              text: tlsFormTexts.selfSigned,
            },
            {
              value: AuthenticationMethod.CaCertificate,
              text: tlsFormTexts.ca,
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
          label: tlsFormTexts.usePemLabel,
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
          label: tlsFormTexts.advancedLabel,
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
