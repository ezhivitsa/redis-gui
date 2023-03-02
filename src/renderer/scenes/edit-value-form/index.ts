import { glueStore } from 'renderer/lib/mobx';

import { RootStore } from 'renderer/stores/root';

import { EditValueFormStore } from './edit-value-form-store';
import { EditValueFormView } from './edit-value-form-view';

const [useStore, hoc] = glueStore(
  new EditValueFormStore({
    valueTabsStore: RootStore.valueTabsStore,
    connectionsDataStore: RootStore.connectionsDataStore,
  }),
);

export const EditValueForm = hoc(EditValueFormView);
export { useStore };
