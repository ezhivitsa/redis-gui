import React, { ReactElement, ReactNode, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { Connection } from 'lib/db';
import { useStyles } from 'lib/theme';

import { useConnectionsStore } from 'providers';

import { Spinner, SpinnerView } from 'components/spinner';
import { Paragraph, ParagraphSize } from 'components/paragraph';

import { ComponentsListTable } from './components/components-list-table';

import styles from './connections-list.pcss';

interface Props {
  onDoubleClick: () => void;
  className?: string;
}

export const ConnectionsList = observer(({ onDoubleClick, className }: Props): ReactElement => {
  const cn = useStyles(styles, 'connections-list');
  const connectionsStore = useConnectionsStore();
  const { isLoading, connections, selectedConnection } = connectionsStore;

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

  function renderNoConnectionsText(): ReactNode {
    if (connections?.length) {
      return null;
    }

    return (
      <Paragraph size={ParagraphSize.S} className={cn('empty')}>
        No connections yet
      </Paragraph>
    );
  }

  return (
    <div>
      <ComponentsListTable
        className={className}
        list={connections}
        active={selectedConnection}
        onConnectionClick={handleConnectionClick}
        onConnectionDoubleClick={handleConnectionConnect}
      />

      {renderNoConnectionsText()}
    </div>
  );
});
