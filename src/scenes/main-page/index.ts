import { glueStore } from 'lib/mobx';

import { MainPageStore } from './main-page-store';
import { MainPageView } from './main-page-view';

const [useStore, hoc] = glueStore(new MainPageStore());

export const MainPage = hoc(MainPageView);
export { useStore };
