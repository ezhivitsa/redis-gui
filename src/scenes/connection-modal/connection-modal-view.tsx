import React, { ReactElement, ReactNode, useState, useEffect } from 'react';
import { Formik, FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

import { useStyles } from 'lib/theme';

import { Modal } from 'components/modal';
import { Tabs, TabItem } from 'components/tabs';
import { Button, ButtonSize, ButtonView } from 'components/button';

import { MainForm } from './components/main-form';
import { AuthenticationForm } from './components/authentication-form';
import { SshForm } from './components/ssh-form';
import { TlsForm } from './components/tls-form';
import { AdvancedForm } from './components/advanced-form';

import { useStore } from './index';

import { ConnectionFormikValues } from './types';

import styles from './connection-modal.pcss';

enum ConnectionTab {
  Connection = 'connection',
  Authentication = 'authentication',
  Ssh = 'ssh',
  Tls = 'tls',
  Advanced = 'advanced',
}

export interface Props {
  id?: string;
  onClose?: () => void;
  open: boolean;
}

const tabs: TabItem<ConnectionTab>[] = [
  {
    value: ConnectionTab.Connection,
    text: 'Connection',
  },
  {
    value: ConnectionTab.Authentication,
    text: 'Authentication',
  },
  {
    value: ConnectionTab.Ssh,
    text: 'SSH',
  },
  {
    value: ConnectionTab.Tls,
    text: 'TLS',
  },
  {
    value: ConnectionTab.Advanced,
    text: 'Advanced',
  },
];

export const ConnectionModalView = observer(({ open, id, onClose }: Props): ReactElement => {
  const cn = useStyles(styles, 'connection-modal');
  const [activeTab, setActiveTab] = useState(ConnectionTab.Connection);

  const connectionStore = useStore();
  const { initialValues, isSaving, isLoading } = connectionStore;

  useEffect(() => {
    if (open) {
      connectionStore.onMounted(id);
    } else {
      connectionStore.dispose();
    }
  }, [open]);

  async function handleUpdateConnection(values: ConnectionFormikValues): Promise<void> {
    await connectionStore.createOrUpdateConnection(values);
    onClose?.();
  }

  function renderForm(): ReactNode {
    switch (activeTab) {
      case ConnectionTab.Connection:
        return <MainForm isSaving={isSaving} />;

      case ConnectionTab.Authentication:
        return <AuthenticationForm isSaving={isSaving} />;

      case ConnectionTab.Ssh:
        return <SshForm isSaving={isSaving} />;

      case ConnectionTab.Tls:
        return <TlsForm isSaving={isSaving} />;

      case ConnectionTab.Advanced:
        return <AdvancedForm isSaving={isSaving} />;

      default:
        return null;
    }
  }

  function renderActions(formikProps: FormikProps<ConnectionFormikValues>): ReactNode {
    return (
      <div className={cn('actions')}>
        <Button
          className={cn('test-connection-btn')}
          size={ButtonSize.S}
          view={ButtonView.Default}
          icon={faGlobe}
          disabled={isSaving}
        >
          Test connection
        </Button>

        <Button
          className={cn('action-btn')}
          size={ButtonSize.S}
          view={ButtonView.Default}
          onClick={onClose}
          disabled={isSaving}
        >
          Cancel
        </Button>

        <Button
          className={cn('action-btn')}
          size={ButtonSize.S}
          view={ButtonView.Success}
          onClick={formikProps.handleSubmit}
          disabled={isSaving}
          type="submit"
        >
          Save
        </Button>
      </div>
    );
  }

  function renderFormContent(formikProps: FormikProps<ConnectionFormikValues>): ReactNode {
    return (
      <>
        {renderForm()}
        {renderActions(formikProps)}
      </>
    );
  }

  function renderContent(): ReactNode {
    if (isLoading) {
      return null;
    }

    return (
      <Formik initialValues={initialValues} onSubmit={handleUpdateConnection}>
        {renderFormContent}
      </Formik>
    );
  }

  return (
    <Modal open={open} title={id ? 'Edit connection' : 'Create connection'} className={cn()} onClose={onClose}>
      <Tabs className={cn('tabs')} items={tabs} active={activeTab} onChange={setActiveTab} />

      {renderContent()}
    </Modal>
  );
});
