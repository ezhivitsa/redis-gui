import { createContext, useContext, useMemo } from 'react';

import { ConnectionsStore, ConnectionStore } from 'stores';

export const ConnectionsStoreContext = createContext(new ConnectionsStore(new ConnectionStore()));
export const ConnectionsStoreProvider = ConnectionsStoreContext.Provider;

export const useConnectionsStore = (): ConnectionsStore => useContext(ConnectionsStoreContext);
export const useNewConnectionsStore = (connectionStore: ConnectionStore): ConnectionsStore =>
  useMemo(() => new ConnectionsStore(connectionStore), [connectionStore]);
