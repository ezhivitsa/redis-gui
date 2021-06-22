import React, { ReactElement, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { Connection } from 'lib/db';

import { useConnectionsStore } from 'providers';

import { Spinner, SpinnerView } from 'components/spinner';

import { ComponentsListTable } from './components/components-list-table';

interface Props {
  onDoubleClick: () => void;
}

export const ConnectionsList = observer(({ onDoubleClick }: Props): ReactElement => {
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

  function handleConnectionConnect(connection: Connection): void {
    connectionsStore.setSelected(connection);
    onDoubleClick();
  }

  if (isLoading || !connections) {
    return <Spinner view={SpinnerView.Block} />;
  }

  return (
    <ComponentsListTable
      list={connections}
      onConnectionClick={handleConnectionClick}
      onConnectionDoubleClick={handleConnectionConnect}
    />
  );
});
