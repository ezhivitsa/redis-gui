import React, { ReactElement, ReactNode } from 'react';
import { useField } from 'formik';

import { useStyles } from 'lib/theme';
import { AuthenticationMethod } from 'lib/db';

import { ConnectionFormikField, ConnectionTlsFormikField, ConnectionTlsFormikValues } from 'stores';

import { Checkbox, CheckboxSize, CheckboxWidth } from 'components/checkbox';
import { Select, SelectSize, SelectWidth } from 'components/select';
import { UploadInput } from 'components/upload-input';
import { InputSize } from 'components/input';
import { FormikField } from 'components/formik-field';

import styles from './tls-form.pcss';

export function TlsForm(): ReactElement {
  const cn = useStyles(styles, 'tls-form');

  const [enabledField] = useField<ConnectionTlsFormikValues[ConnectionTlsFormikField.Enabled]>(
    `${ConnectionFormikField.Tls}.${ConnectionTlsFormikField.Enabled}`,
  );
  const [authenticationMethodField] = useField<
    ConnectionTlsFormikValues[ConnectionTlsFormikField.AuthenticationMethod]
  >(`${ConnectionFormikField.Tls}.${ConnectionTlsFormikField.AuthenticationMethod}`);
  const [, , caCertificateHelper] = useField<ConnectionTlsFormikValues[ConnectionTlsFormikField.CaCertificate]>(
    ConnectionTlsFormikField.CaCertificate,
  );

  const disabled = !enabledField.value;

  function handleAuthenticationMethodChange(): void {
    caCertificateHelper.setValue(undefined);
  }

  function renderCaCertificateFields(): ReactNode {
    if (authenticationMethodField.value !== AuthenticationMethod.CaCertificate) {
      return null;
    }

    return (
      <FormikField
        name={`${ConnectionFormikField.Tls}.${ConnectionTlsFormikField.CaCertificate}`}
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

  return (
    <div>
      <FormikField
        name={`${ConnectionFormikField.Tls}.${ConnectionTlsFormikField.Enabled}`}
        component={Checkbox}
        componentProps={{
          label: 'Use TLS protocol',
          size: CheckboxSize.S,
          width: CheckboxWidth.Available,
          className: cn('item'),
        }}
      />

      <FormikField
        name={`${ConnectionFormikField.Tls}.${ConnectionTlsFormikField.AuthenticationMethod}`}
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
          disabled,
        }}
      />

      {renderCaCertificateFields()}
    </div>
  );
}
