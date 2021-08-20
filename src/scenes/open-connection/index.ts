import { glueStore } from 'lib/mobx';

import { RootStore } from 'stores/root';

import { OpenConnectionsStore } from './open-connection-store';
import { OpenConnectionView } from './open-connection-view';

const [useStore, hoc] = glueStore(
  new OpenConnectionsStore({
    connectionsDataStore: RootStore.connectionsDataStore,
    valueTabsStore: RootStore.valueTabsStore,
  }),
);

export const OpenConnection = hoc(OpenConnectionView);
export { useStore };
