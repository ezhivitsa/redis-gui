import { glueStore } from 'renderer/lib/mobx';

import { RootStore } from 'renderer/stores';

import { MainPageStore } from './main-page-store';
import { MainPageView } from './main-page-view';

const [useStore, hoc] = glueStore(
  new MainPageStore({
    valueTabsStore: RootStore.valueTabsStore,
    connectionsDataStore: RootStore.connectionsDataStore,
  }),
);

export const MainPage = hoc(MainPageView);
export { useStore };
