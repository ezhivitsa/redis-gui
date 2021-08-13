import { ConnectionsStore } from './connections-store';
import { ConnectionStore } from './connection-store';
import { ConnectionDataStore } from './connection-data-store';

export const RootStore = {
  connectionsStore: new ConnectionsStore(),
  connectionStore: new ConnectionStore(),
  connectionDataStore: new ConnectionDataStore(),
};
