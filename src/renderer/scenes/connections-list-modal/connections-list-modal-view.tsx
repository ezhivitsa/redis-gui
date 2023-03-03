import { faClone, faPen, faPlug, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { observer } from 'mobx-react-lite';
import { ReactElement, ReactNode, useEffect } from 'react';

import { Redis } from 'renderer/lib/redis';
import { useStyles } from 'renderer/lib/theme';

import { Button, ButtonSize, ButtonView } from 'renderer/ui/button';
import { Modal } from 'renderer/ui/modal';

import { AskDataForm, AskDataValues } from 'renderer/components/ask-data-form';

import { ConnectionModal } from 'renderer/scenes/connection-modal';

import { connectionsListTexts } from 'texts';

import { ConnectionsList } from './components/connections-list';

import { useStore } from './index';

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
          {connectionsListTexts.deleteBtn}
        </Button>

        <Button
          className={cn('action-btn')}
          size={ButtonSize.S}
          icon={faPen}
          onClick={handleEditClick}
          disabled={isDeleting || isCloning || !hasSelectedConnection}
        >
          {connectionsListTexts.editBtn}
        </Button>

        <Button
          className={cn('action-btn')}
          size={ButtonSize.S}
          icon={faClone}
          onClick={handleCloneClick}
          disabled={isDeleting || isCloning || !hasSelectedConnection}
        >
          {connectionsListTexts.cloneBtn}
        </Button>

        <Button
          className={cn('action-btn')}
          size={ButtonSize.S}
          icon={faPlug}
          onClick={handleConnectClick}
          disabled={isDeleting || isCloning || !hasSelectedConnection}
        >
          {connectionsListTexts.connectBtn}
        </Button>
      </div>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title={connectionsListTexts.modalTitle} className={cn()}>
      <div>
        <Button size={ButtonSize.S} onClick={handleCreateConnection}>
          {connectionsListTexts.createBtn}
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
