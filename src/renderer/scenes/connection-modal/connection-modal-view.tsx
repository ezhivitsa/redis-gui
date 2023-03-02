import React, { ReactElement, ReactNode, useState, useEffect } from 'react';
import { Formik, FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

import { useStyles } from 'renderer/lib/theme';

import { Modal } from 'renderer/ui/modal';
import { Tabs, TabItem } from 'renderer/ui/tabs';
import { Button, ButtonSize, ButtonView } from 'renderer/ui/button';

import { AskDataForm, AskDataValues } from 'renderer/components/ask-data-form';

import { connectionModalTexts } from 'texts';

import { MainForm } from './components/main-form';
import { AuthenticationForm } from './components/authentication-form';
import { SshForm } from './components/ssh-form';
import { TlsForm } from './components/tls-form';
import { AdvancedForm } from './components/advanced-form';
import { TestConnectResult } from './components/test-connect-result';

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
    text: connectionModalTexts.connectionTab,
  },
  {
    value: ConnectionTab.Authentication,
    text: connectionModalTexts.authenticationTab,
  },
  {
    value: ConnectionTab.Ssh,
    text: connectionModalTexts.sshTab,
  },
  {
    value: ConnectionTab.Tls,
    text: connectionModalTexts.tlsTab,
  },
  {
    value: ConnectionTab.Advanced,
    text: connectionModalTexts.advancedTab,
  },
];

export const ConnectionModalView = observer(({ open, id, onClose }: Props): ReactElement => {
  const cn = useStyles(styles, 'connection-modal');
  const [activeTab, setActiveTab] = useState(ConnectionTab.Connection);

  const connectionStore = useStore();
  const { initialValues, isSaving, isLoading, showAskDataForm, askData } = connectionStore;

  useEffect(() => {
    if (open) {
      connectionStore.onMounted(id);
      setActiveTab(ConnectionTab.Connection);
    } else {
      connectionStore.dispose();
    }
  }, [open]);

  async function handleUpdateConnection(values: ConnectionFormikValues): Promise<void> {
    await connectionStore.createOrUpdateConnection(values);
    onClose?.();
  }

  function handleTestClick(values: ConnectionFormikValues): void {
    connectionStore.createTestConnection(values);
  }

  function handleCloseAskDataForm(): void {
    connectionStore.setAskDataFormOpen(false);
  }

  function handleSaveAskData(values: AskDataValues): void {
    connectionStore.testConnect(values);
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
          onClick={() => handleTestClick(formikProps.values)}
        >
          {connectionModalTexts.testConnectionBtn}
        </Button>

        <Button
          className={cn('action-btn')}
          size={ButtonSize.S}
          view={ButtonView.Default}
          onClick={onClose}
          disabled={isSaving}
        >
          {connectionModalTexts.cancelBtn}
        </Button>

        <Button
          className={cn('action-btn')}
          size={ButtonSize.S}
          view={ButtonView.Success}
          onClick={formikProps.handleSubmit}
          disabled={isSaving}
          type="submit"
        >
          {connectionModalTexts.saveBtn}
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
    <Modal
      open={open}
      title={id ? connectionModalTexts.editConnectionTitle : connectionModalTexts.createConnectionTitle}
      className={cn()}
      onClose={onClose}
    >
      <Tabs className={cn('tabs')} items={tabs} active={activeTab} onChange={setActiveTab} />

      {renderContent()}

      <AskDataForm
        open={showAskDataForm}
        onClose={handleCloseAskDataForm}
        onSave={handleSaveAskData}
        askSshPassphrase={askData.sshPassphrase}
        askSshPassword={askData.sshPassword}
        askTlsPassphrase={askData.tlsPassphrase}
      />

      <TestConnectResult />
    </Modal>
  );
});
