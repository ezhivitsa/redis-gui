import { ConnectionsStore } from './connections-store';
import { ConnectionStore } from './connection-store';

export const RootStore = {
  connectionsStore: new ConnectionsStore(),
  connectionStore: new ConnectionStore(),
};
