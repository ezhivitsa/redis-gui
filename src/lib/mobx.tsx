import React, { ReactElement, FC, createContext, useContext, useMemo } from 'react';

import { SceneStore } from 'types';

type UseStoreFn<Store extends SceneStore> = () => Store;

type HocType = <OwnProps>(component: FC<OwnProps>) => FC<OwnProps>;

export function glueStore<Store extends SceneStore>(store: Store): [UseStoreFn<Store>, HocType] {
  const StoreContext = createContext(store);
  const StoreProvider = StoreContext.Provider;

  const useStore = (): Store => useContext(StoreContext);
  const useNewStore = (): Store => useMemo(() => store, []);

  function hoc<OwnProps>(Component: FC<OwnProps>) {
    return function HocComponent(props: OwnProps): ReactElement {
      const componentStore = useNewStore();

      return (
        <StoreProvider value={componentStore}>
          <Component {...props} />
        </StoreProvider>
      );
    };
  }

  return [useStore, hoc];
}
