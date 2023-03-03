import { ConnectionStore } from './connection-store';
import { ConnectionsDataStore } from './connections-data-store';
import { ConnectionsStore } from './connections-store';
import { ValueTabsStore } from './value-tabs-store';

const valueTabsStore = new ValueTabsStore();

export const RootStore = {
  connectionsStore: new ConnectionsStore(),
  connectionStore: new ConnectionStore(),
  valueTabsStore,
  connectionsDataStore: new ConnectionsDataStore({ valueTabsStore }),
};
