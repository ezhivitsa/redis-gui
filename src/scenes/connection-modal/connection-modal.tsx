import React, { ReactElement, ReactNode, useState, useEffect } from 'react';
import { Formik, FormikProps } from 'formik';

import { Connection } from 'lib/db';
import { useStyles } from 'lib/theme';

import { ConnectionFormikValues } from 'stores';
import { useConnectionStore } from 'providers';

import { Modal } from 'components/modal';
import { Tabs, TabItem } from 'components/tabs';
import { Button, ButtonSize, ButtonView } from 'components/button';

import { ConnectionTabForm } from './components/connection-tab-form';

import styles from './connection-modal.pcss';

enum ConnectionTab {
  Connection = 'connection',
  Authentication = 'authentication',
  Ssh = 'ssh',
  Tls = 'tls',
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
        return <ConnectionTabForm />;

      default:
        return null;
    }
  }

  function renderActions(formikProps: FormikProps<ConnectionFormikValues>): ReactNode {
    return (
      <div className={cn('actions')}>
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
