import { glueStore } from 'lib/mobx';

import { RootStore } from 'stores';

import { ConnectionsListModalStore } from './connections-list-modal-store';
import { ConnectionsListModalView } from './connections-list-modal-view';

const [useStore, hoc] = glueStore(
  new ConnectionsListModalStore({
    connectionsStore: RootStore.connectionsStore,
  }),
);

export const ConnectionsListModal = hoc(ConnectionsListModalView);
export { useStore };
