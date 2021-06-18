import React, { ReactElement, useState } from 'react';

import { useStyles } from 'lib/theme';

import { ConnectionsListModal } from 'scenes/connections-list-modal';

import styles from './main-page.pcss';

export function MainPage(): ReactElement {
  const [connectionsOpen, setConnectionsOpen] = useState(false);
  const cn = useStyles(styles, 'main-page');

  function handleOpenConnections(): void {
    setConnectionsOpen(true);
  }

  function handleConnectionsModalClose(): void {
    setConnectionsOpen(false);
  }

  return (
    <div className={cn()}>
      <input />
      <button onClick={handleOpenConnections}>Open connections list</button>
      <ConnectionsListModal open={connectionsOpen} onClose={handleConnectionsModalClose} />
    </div>
  );
}
