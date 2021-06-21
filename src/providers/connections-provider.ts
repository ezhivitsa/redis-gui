import { createContext, useContext, useMemo } from 'react';

import { ConnectionsStore } from 'stores';

export const ConnectionsStoreContext = createContext(new ConnectionsStore());
export const ConnectionsStoreProvider = ConnectionsStoreContext.Provider;

export const useConnectionsStore = (): ConnectionsStore => useContext(ConnectionsStoreContext);
export const useNewConnectionsStore = (): ConnectionsStore => useMemo(() => new ConnectionsStore(), []);
