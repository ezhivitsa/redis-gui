import { glueStore } from 'lib/mobx';

import { RootStore } from 'stores/root';

import { EditValueFormStore } from './edit-value-form-store';
import { EditValueFormView } from './edit-value-form-view';

const [useStore, hoc] = glueStore(new EditValueFormStore({ connectionDataStore: RootStore.connectionDataStore }));

export const EditValueForm = hoc(EditValueFormView);
export { useStore };
