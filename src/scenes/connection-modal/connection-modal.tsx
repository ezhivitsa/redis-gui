import React, { ReactElement, ReactNode, useState, useEffect } from 'react';
import { Formik, FormikProps } from 'formik';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

import { Connection } from 'lib/db';
import { useStyles } from 'lib/theme';

import { ConnectionFormikValues } from 'stores';
import { useConnectionStore } from 'providers';

import { Modal } from 'components/modal';
import { Tabs, TabItem } from 'components/tabs';
import { Button, ButtonSize, ButtonView } from 'components/button';

import { MainForm } from './components/main-form';
import { AuthenticationForm } from './components/authentication-form';
import { SshForm } from './components/ssh-form';
import { TlsForm } from './components/tls-form';
import { AdvancedForm } from './components/advanced-form';

import styles from './connection-modal.pcss';

enum ConnectionTab {
  Connection = 'connection',
  Authentication = 'authentication',
  Ssh = 'ssh',
  Tls = 'tls',
  Advanced = 'advanced',
}

interface Props {
  connection?: Connection;
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

export function ConnectionModal({ open, connection, onClose }: Props): ReactElement {
  const cn = useStyles(styles, 'connection-modal');
  const [activeTab, setActiveTab] = useState(ConnectionTab.Connection);

  const connectionStore = useConnectionStore();
  const { initialValues } = connectionStore;

  useEffect(() => {
    return () => {
      connectionStore.dispose();
    };
  }, [connectionStore]);

  function handleUpdateConnection(values: ConnectionFormikValues): void {
    connectionStore.createOrUpdateConnection(values);
  }

  function renderForm(): ReactNode {
    switch (activeTab) {
      case ConnectionTab.Connection:
        return <MainForm />;

      case ConnectionTab.Authentication:
        return <AuthenticationForm />;

      case ConnectionTab.Ssh:
        return <SshForm />;

      case ConnectionTab.Tls:
        return <TlsForm />;

      case ConnectionTab.Advanced:
        return <AdvancedForm />;

      default:
        return null;
    }
  }

  function renderActions(formikProps: FormikProps<ConnectionFormikValues>): ReactNode {
    return (
      <div className={cn('actions')}>
        <Button className={cn('test-connection-btn')} size={ButtonSize.S} view={ButtonView.Default} icon={faGlobe}>
          Test connection
        </Button>

        <Button className={cn('action-btn')} size={ButtonSize.S} view={ButtonView.Default} onClick={onClose}>
          Cancel
        </Button>

        <Button
          className={cn('action-btn')}
          size={ButtonSize.S}
          view={ButtonView.Success}
          onClick={formikProps.handleSubmit}
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

  return (
    <Modal open={open} title={connection ? 'Edit connection' : 'Create connection'} className={cn()} onClose={onClose}>
      <Tabs className={cn('tabs')} items={tabs} active={activeTab} onChange={setActiveTab} />

      <Formik initialValues={initialValues} onSubmit={handleUpdateConnection}>
        {renderFormContent}
      </Formik>
    </Modal>
  );
}
