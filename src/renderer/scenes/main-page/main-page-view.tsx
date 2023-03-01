import React, { ReactElement, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { ipcRenderer } from 'electron';

import { useStyles } from 'lib/theme';
import { Redis } from 'lib/redis';

import { MenuEvent } from 'menu';

import { ConnectionsListModal } from 'scenes/connections-list-modal';
import { EditValueForm } from 'scenes/edit-value-form';

import { useStore } from './index';

import { OpenConnectionsList } from './components/open-connections-list';
import { TopActions } from './components/top-actions';
import { ResizableLayout } from './components/resizable-layout';

import styles from './main-page.pcss';

export const MainPageView = observer((): ReactElement => {
  const cn = useStyles(styles, 'main-page');

  const pageStore = useStore();
  const { connectionsListOpened, openConnections, hasActiveTab, hasSelectedItem, isDeleting, isDisconnecting } =
    pageStore;

  useEffect(() => {
    ipcRenderer.on(MenuEvent.OpenConnectionsList, handleOpenConnections);

    return () => {
      ipcRenderer.off(MenuEvent.OpenConnectionsList, handleOpenConnections);
    };
  }, []);

  function handleOpenConnections(): void {
    pageStore.setConnectionsListOpened(true);
  }

  function handleConnectionsModalClose(): void {
    pageStore.setConnectionsListOpened(false);
  }

  function handleConnect(redis: Redis): void {
    pageStore.addOpenConnection(redis);
  }

  function handleDeleteKey(): void {
    pageStore.deleteActiveKey();
  }

  function handleCancelSelect(): void {
    pageStore.cancelActiveKey();
  }

  function handleDisconnectClick(): void {
    pageStore.disconnectConnection();
  }

  return (
    <div className={cn()}>
      <TopActions
        hasSelectedItem={hasSelectedItem}
        hasActiveTab={hasActiveTab}
        isDeleting={isDeleting}
        isDisconnecting={isDisconnecting}
        onOpenConnections={handleOpenConnections}
        onDisconnect={handleDisconnectClick}
        onCancelSelect={handleCancelSelect}
        onDeleteKey={handleDeleteKey}
      />

      <ResizableLayout
        left={<OpenConnectionsList />}
        right={openConnections.length > 0 && <EditValueForm connections={openConnections} />}
      />

      <ConnectionsListModal
        open={connectionsListOpened}
        onClose={handleConnectionsModalClose}
        onConnect={handleConnect}
      />
    </div>
  );
});
