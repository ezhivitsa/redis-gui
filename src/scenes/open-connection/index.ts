import { glueStore } from 'lib/mobx';

import { RootStore } from 'stores/root';

import { OpenConnectionStore } from './open-connection-store';
import { OpenConnectionView } from './open-connection-view';

const [useStore, hoc] = glueStore(new OpenConnectionStore({ connectionDataStore: RootStore.connectionDataStore }));

export const OpenConnection = hoc(OpenConnectionView);
export { useStore };
