import React, { ReactElement, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';

import { PageState } from 'types';

import { Connection } from 'lib/db';
import { useStyles } from 'lib/theme';

import { Spinner, SpinnerView } from 'ui/spinner';
import { Paragraph, ParagraphSize } from 'ui/paragraph';

import { ComponentsListTable } from './components/components-list-table';

import { useStore } from 'scenes/connections-list-modal';

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
        No connections yet
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
