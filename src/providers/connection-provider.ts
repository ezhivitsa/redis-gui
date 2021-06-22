import { createContext, useContext, useMemo } from 'react';

import { ConnectionStore } from 'stores';

export const ConnectionStoreContext = createContext(new ConnectionStore());
export const ConnectionStoreProvider = ConnectionStoreContext.Provider;

export const useConnectionStore = (): ConnectionStore => useContext(ConnectionStoreContext);
export const useNewConnectionStore = (): ConnectionStore => useMemo(() => new ConnectionStore(), []);
