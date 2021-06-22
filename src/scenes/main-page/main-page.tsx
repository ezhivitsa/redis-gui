import React, { ReactElement, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useStyles } from 'lib/theme';

import {
  ConnectionStoreProvider,
  ConnectionsStoreProvider,
  useConnectionStore,
  useNewConnectionStore,
  useNewConnectionsStore,
} from 'providers';

import { ConnectionsListModal } from 'scenes/connections-list-modal';
import { ConnectionModal } from 'scenes/connection-modal';

import styles from './main-page.pcss';

const MainPageComponent = observer((): ReactElement => {
  const [connectionsOpen, setConnectionsOpen] = useState(false);
  const cn = useStyles(styles, 'main-page');

  const connectionStore = useConnectionStore();
  const { modalVisible } = connectionStore;

  function handleOpenConnections(): void {
    setConnectionsOpen(true);
  }

  function handleConnectionsModalClose(): void {
    setConnectionsOpen(false);
  }

  function handleCloseConnectionModal(): void {
    connectionStore.closeModal();
  }

  return (
    <div className={cn()}>
      <button onClick={handleOpenConnections}>Open connections list</button>
      <ConnectionsListModal open={connectionsOpen} onClose={handleConnectionsModalClose} />
      <ConnectionModal open={modalVisible} onClose={handleCloseConnectionModal} />
    </div>
  );
});

export function MainPage(): ReactElement {
  const connectionStore = useNewConnectionStore();
  const connectionsStore = useNewConnectionsStore(connectionStore);

  return (
    <ConnectionStoreProvider value={connectionStore}>
      <ConnectionsStoreProvider value={connectionsStore}>
        <MainPageComponent />
      </ConnectionsStoreProvider>
    </ConnectionStoreProvider>
  );
}
