import React, { ReactElement, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';

import { PageState } from 'renderer/types';

import { Connection } from 'renderer/lib/db';
import { useStyles } from 'renderer/lib/theme';

import { Spinner, SpinnerView } from 'renderer/ui/spinner';
import { Paragraph, ParagraphSize } from 'renderer/ui/paragraph';

import { connectionsListTexts } from 'texts';

import { ComponentsListTable } from './components/components-list-table';

import { useStore } from 'renderer/scenes/connections-list-modal';

import styles from './connections-list.pcss';

interface Props {
  onDoubleClick: () => void;
  className?: string;
}

export const ConnectionsList = observer(({ onDoubleClick, className }: Props): ReactElement => {
  const cn = useStyles(styles, 'connections-list');

  const store = useStore();
  const { sceneState, connections, selectedConnection } = store;

  function handleConnectionClick(connection: Connection): void {
    store.setSelected(connection);
  }

  function handleConnectionConnect(connection: Connection): void {
    store.setSelected(connection);
    onDoubleClick();
  }

  function handleResetConnection(): void {
    store.setSelected(null);
  }

  if (sceneState === PageState.LOADING) {
    return <Spinner view={SpinnerView.Block} />;
  }

  function renderNoConnectionsText(): ReactNode {
    if (connections.length) {
      return null;
    }

    return (
      <Paragraph size={ParagraphSize.S} className={cn('empty')}>
        {connectionsListTexts.noConnections}
      </Paragraph>
    );
  }

  return (
    <div className={cn()}>
      <ComponentsListTable
        className={className}
        list={connections}
        active={selectedConnection}
        onConnectionClick={handleConnectionClick}
        onConnectionDoubleClick={handleConnectionConnect}
        onResetConnection={handleResetConnection}
      />

      {renderNoConnectionsText()}
    </div>
  );
});
