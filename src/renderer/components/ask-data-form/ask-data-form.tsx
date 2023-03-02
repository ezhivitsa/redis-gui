import React, { ReactElement, ReactNode } from 'react';
import { Formik, FormikProps } from 'formik';

import { useStyles } from 'renderer/lib/theme';

import { Modal } from 'renderer/ui/modal';
import { FormikField } from 'renderer/ui/formik-field';
import { PasswordInput, InputSize, InputWidth } from 'renderer/ui/password-input';
import { Button, ButtonSize, ButtonView } from 'renderer/ui/button';

import { askDataTexts } from 'texts';

import { AskDataField, AskDataValues } from './types';

import styles from './ask-data-form.pcss';

interface Props {
  open: boolean;
  askSshPassphrase?: boolean;
  askSshPassword?: boolean;
  askTlsPassphrase?: boolean;
  onClose: () => void;
  onSave: (values: AskDataValues) => void;
}

const mapFieldToLabel: Record<AskDataField, string> = {
  [AskDataField.SshPassword]: askDataTexts.sshPassword,
  [AskDataField.SshPassphrase]: askDataTexts.sshPassphrase,
  [AskDataField.TlsPassphrase]: askDataTexts.tlsPassphrase,
};

export function AskDataForm({
  open,
  onClose,
  onSave,
  askSshPassphrase,
  askSshPassword,
  askTlsPassphrase,
}: Props): ReactElement {
  const cn = useStyles(styles, 'ask-data-form');

  function handleSubmit(formikProps: FormikProps<AskDataValues>): void {
    formikProps.handleSubmit();
    onClose();
  }

  function renderItem(name: AskDataField): ReactNode {
    return (
      <FormikField
        key={name}
        name={name}
        component={PasswordInput}
        componentProps={{
          label: mapFieldToLabel[name],
          size: InputSize.S,
          width: InputWidth.Available,
          className: cn('item'),
        }}
      />
    );
  }

  function renderForm(formikProps: FormikProps<AskDataValues>): ReactNode {
    const fields: AskDataField[] = [];

    if (askSshPassphrase) {
      fields.push(AskDataField.SshPassphrase);
    }
    if (askSshPassword) {
      fields.push(AskDataField.SshPassword);
    }
    if (askTlsPassphrase) {
      fields.push(AskDataField.TlsPassphrase);
    }

    return (
      <>
        {fields.map(renderItem)}
        <div className={cn('actions')}>
          <Button size={ButtonSize.S} view={ButtonView.Default} onClick={() => handleSubmit(formikProps)}>
            {askDataTexts.connectBtn}
          </Button>
        </div>
      </>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title={askDataTexts.title}>
      <Formik
        initialValues={{
          sshPassphrase: askSshPassphrase ? '' : undefined,
          sshPassword: askSshPassword ? '' : undefined,
          tlsPassphrase: askTlsPassphrase ? '' : undefined,
        }}
        onSubmit={onSave}
      >
        {renderForm}
      </Formik>
    </Modal>
  );
}
