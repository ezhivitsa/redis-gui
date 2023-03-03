import { Formik, FormikProps } from 'formik';
import { ReactElement, ReactNode } from 'react';

import { useStyles } from 'renderer/lib/theme';

import { Button, ButtonSize, ButtonView } from 'renderer/ui/button';
import { FormikField } from 'renderer/ui/formik-field';
import { Modal } from 'renderer/ui/modal';
import { InputSize, InputWidth, PasswordInput } from 'renderer/ui/password-input';

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

  const initialValues: AskDataValues = {
    sshPassphrase: askSshPassphrase ? '' : undefined,
    sshPassword: askSshPassword ? '' : undefined,
    tlsPassphrase: askTlsPassphrase ? '' : undefined,
  };

  return (
    <Modal open={open} onClose={onClose} title={askDataTexts.title}>
      <Formik initialValues={initialValues} onSubmit={onSave}>
        {renderForm}
      </Formik>
    </Modal>
  );
}
