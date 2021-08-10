import { glueStore } from 'lib/mobx';

import { OpenConnectionStore } from './open-connection-store';
import { OpenConnectionView } from './open-connection-view';

const [useStore, hoc] = glueStore(new OpenConnectionStore());

export const OpenConnection = hoc(OpenConnectionView);
export { useStore };
