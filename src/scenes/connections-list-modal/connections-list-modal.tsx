import React, { ReactElement, ReactNode } from 'react';
import { faTrashAlt, faPen, faClone, faPlug } from '@fortawesome/free-solid-svg-icons';

import { useStyles } from 'lib/theme';

import { useConnectionsStore } from 'providers';

import { Modal } from 'components/modal';
import { Button, ButtonSize, ButtonView } from 'components/button';

import { ConnectionsList } from 'scenes/connections-list';

import styles from './connections-list-modal.pcss';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ConnectionsListModal({ open, onClose }: Props): ReactElement {
  const cn = useStyles(styles, 'connections-list-modal');
  // const connectionsStore = useConnectionsStore();
  // const { selectedConnection, isDeleting } = connectionsStore;

  // function handleCreateConnection(): void {
  //   connectionsStore.openCreateConnection();
  // }

  // function handleEditClick(): void {
  //   connectionsStore.openEditConnection();
  // }

  // function handleDeleteClick(): void {
  //   connectionsStore.deleteConnection();
  // }

  // function handleCloneClick(): void {
  //   connectionsStore.cloneConnection();
  // }

  // function handleConnectClick(): void {}

  function renderConnectionActions(): ReactNode {
    if (!selectedConnection) {
      return null;
    }

    return (
      <div className={cn('actions')}>
        <Button
          className={cn('delete-btn')}
          size={ButtonSize.S}
          view={ButtonView.Danger}
          icon={faTrashAlt}
          onClick={handleDeleteClick}
          disabled={isDeleting}
        >
          Delete
        </Button>

        <Button
          className={cn('action-btn')}
          size={ButtonSize.S}
          icon={faPen}
          onClick={handleEditClick}
          disabled={isDeleting}
        >
          Edit
        </Button>

        <Button
          className={cn('action-btn')}
          size={ButtonSize.S}
          icon={faClone}
          onClick={handleCloneClick}
          disabled={isDeleting}
        >
          Clone
        </Button>

        <Button
          className={cn('action-btn')}
          size={ButtonSize.S}
          icon={faPlug}
          onClick={handleConnectClick}
          disabled={isDeleting}
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
    </Modal>
  );
}
