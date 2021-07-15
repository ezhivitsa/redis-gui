import React, { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';

import { useStyles } from 'lib/theme';

import { ConnectionsListModal } from 'scenes/connections-list-modal';

import { useStore } from './index';

import styles from './main-page.pcss';

export const MainPageView = observer((): ReactElement => {
  const cn = useStyles(styles, 'main-page');

  const pageStore = useStore();
  const { connectionsListOpened } = pageStore;

  function handleOpenConnections(): void {
    pageStore.setConnectionsListOpened(true);
  }

  function handleConnectionsModalClose(): void {
    pageStore.setConnectionsListOpened(false);
  }

  return (
    <div className={cn()}>
      <button onClick={handleOpenConnections}>Open connections list</button>

      <ConnectionsListModal open={connectionsListOpened} onClose={handleConnectionsModalClose} />
    </div>
  );
});
