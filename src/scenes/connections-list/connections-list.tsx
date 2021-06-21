import React, { ReactElement, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { Connection } from 'lib/db';

import { ConnectionsStoreProvider, useNewConnectionsStore, useConnectionsStore } from 'providers';

import { Spinner, SpinnerView } from 'components/spinner';

import { ComponentsListTable } from './components/components-list-table';

const ConnectionsListComponent = observer((): ReactElement => {
  const connectionsStore = useConnectionsStore();
  const { isLoading, connections } = connectionsStore;

  useEffect(() => {
    connectionsStore.loadData();

    return () => {
      connectionsStore.dispose();
    };
  }, [connectionsStore]);

  function handleConnectionClick(connection: Connection): void {
    connectionsStore.setSelected(connection);
  }

  if (isLoading || !connections) {
    return <Spinner view={SpinnerView.Block} />;
  }

  return <ComponentsListTable list={connections} onConnectionClick={handleConnectionClick} />;
});

export function ConnectionsList(): ReactElement {
  const connectionsStore = useNewConnectionsStore();

  return (
    <ConnectionsStoreProvider value={connectionsStore}>
      <ConnectionsListComponent />
    </ConnectionsStoreProvider>
  );
}
