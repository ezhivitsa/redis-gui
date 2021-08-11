import React, { ReactElement, ReactNode, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { faTrashAlt, faPen, faClone, faPlug } from '@fortawesome/free-solid-svg-icons';

import { useStyles } from 'lib/theme';
import { Redis } from 'lib/redis';

import { Modal } from 'ui/modal';
import { Button, ButtonSize, ButtonView } from 'ui/button';

import { AskDataForm, AskDataValues } from 'components/ask-data-form';

import { ConnectionModal } from 'scenes/connection-modal';

import { useStore } from './index';

import { ConnectionsList } from './components/connections-list';

import styles from './connections-list-modal.pcss';

export interface Props {
  open: boolean;
  onClose: () => void;
  onConnect: (redis: Redis) => void;
}

export const ConnectionsListModalView = observer(({ open, onClose, onConnect }: Props): ReactElement => {
  const cn = useStyles(styles, 'connections-list-modal');

  const store = useStore();
  const {
    editConnectionId,
    selectedConnection,
    isDeleting,
    isCloning,
    createConnectionOpened,
    showAskDataForm,
    askData,
    isConnected,
    redis,
  } = store;

  const hasSelectedConnection = selectedConnection !== null;

  useEffect(() => {
    store.onMounted();

    return () => {
      store.dispose();
    };
  }, []);

  useEffect(() => {
    if (isConnected && redis) {
      onConnect(redis);
      onClose();
    }
  }, [isConnected, redis]);

  function handleCreateConnection(): void {
    store.openCreateModal();
  }

  function handleEditClick(): void {
    store.openEditModal();
  }

  function handleDeleteClick(): void {
    store.deleteConnection();
  }

  function handleCloneClick(): void {
    store.cloneConnection();
  }

  function handleConnectClick(): void {
    store.openConnection();
  }

  function handleCloneConnectionModal(): void {
    store.setCreateConnectionOpened(false);
  }

  function handleCloseAskDataForm(): void {
    store.setAskDataFormOpen(false);
  }

  function handleSaveAskData(values: AskDataValues): void {
    store.connect(values);
  }

  function renderConnectionActions(): ReactNode {
    return (
      <div className={cn('actions')}>
        <Button
          className={cn('delete-btn')}
          size={ButtonSize.S}
          view={ButtonView.Danger}
          icon={faTrashAlt}
          onClick={handleDeleteClick}
          disabled={isDeleting || isCloning || !hasSelectedConnection}
        >
          Delete
        </Button>

        <Button
          className={cn('action-btn')}
          size={ButtonSize.S}
          icon={faPen}
          onClick={handleEditClick}
          disabled={isDeleting || isCloning || !hasSelectedConnection}
        >
          Edit
        </Button>

        <Button
          className={cn('action-btn')}
          size={ButtonSize.S}
          icon={faClone}
          onClick={handleCloneClick}
          disabled={isDeleting || isCloning || !hasSelectedConnection}
        >
          Clone
        </Button>

        <Button
          className={cn('action-btn')}
          size={ButtonSize.S}
          icon={faPlug}
          onClick={handleConnectClick}
          disabled={isDeleting || isCloning || !hasSelectedConnection}
        >
          Connect
        </Button>
      </div>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Redis connections" className={cn()}>
      <div>
        <Button size={ButtonSize.S} onClick={handleCreateConnection}>
          Create
        </Button>
      </div>

      <ConnectionsList onDoubleClick={handleConnectClick} className={cn('connections')} />

      {renderConnectionActions()}

      <ConnectionModal open={createConnectionOpened} onClose={handleCloneConnectionModal} id={editConnectionId} />

      <AskDataForm
        open={showAskDataForm}
        onClose={handleCloseAskDataForm}
        onSave={handleSaveAskData}
        askSshPassphrase={askData.sshPassphrase}
        askSshPassword={askData.sshPassword}
        askTlsPassphrase={askData.tlsPassphrase}
      />
    </Modal>
  );
});
