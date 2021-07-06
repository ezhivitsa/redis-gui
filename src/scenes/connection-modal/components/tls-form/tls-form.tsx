import React, { ReactElement } from 'react';
import { useField } from 'formik';

import { useStyles } from 'lib/theme';
import { AuthenticationMethod } from 'lib/db';

import { ConnectionFormikField, ConnectionTlsFormikField, ConnectionTlsFormikValues } from 'stores';

import { Checkbox, CheckboxSize, CheckboxWidth } from 'components/checkbox';
import { Select, SelectSize, SelectWidth } from 'components/select';
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
  // const [, , tlsFieldHelper] = useField<ConnectionTlsFormikValues>(ConnectionFormikField.Tls);

  const disabled = !enabledField.value;

  function handleAuthenticationMethodChange(): void {
    // remove ca certificate
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
    </div>
  );
}
