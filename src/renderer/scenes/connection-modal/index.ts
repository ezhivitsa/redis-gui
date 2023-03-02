import { glueStore } from 'renderer/lib/mobx';

import { RootStore } from 'renderer/stores';

import { ConnectionModalStore } from './connection-modal-store';
import { ConnectionModalView } from './connection-modal-view';

const [useStore, hoc] = glueStore(
  new ConnectionModalStore({
    connectionsStore: RootStore.connectionsStore,
    connectionStore: RootStore.connectionStore,
  }),
);

export const ConnectionModal = hoc(ConnectionModalView);
export { useStore };
