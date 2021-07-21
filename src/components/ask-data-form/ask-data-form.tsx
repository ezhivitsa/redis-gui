import React, { ReactElement, ReactNode } from 'react';
import { Formik } from 'formik';

import { Modal } from 'components/modal';
import { FormikField } from 'components/formik-field';
import { PasswordInput } from 'components/password-input';

import { AskDataValues } from './types';

interface Props {
  open: boolean;
  askSshPassphrase: boolean;
  askSshPassword: boolean;
  askTlsPassphrase: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function AskDataForm({
  open,
  onClose,
  onSave,
  askSshPassphrase,
  askSshPassword,
  askTlsPassphrase,
}: Props): ReactElement {
  function renderItem(): ReactNode {}

  function renderForm(): ReactNode {}

  return (
    <Modal open={open} onClose={onClose} title="Pass Data">
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
