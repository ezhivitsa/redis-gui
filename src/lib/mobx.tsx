import React, { ReactElement, FC, createContext, useContext, useMemo } from 'react';
import { observer } from 'mobx-react-lite';

import { SceneStore } from 'types';

// type StoreHocFn<
//   StoreOwnProps extends Record<string, any>,
//   CollectedProps extends Record<string, any> = Record<string, any>,
// > = <OwnProps extends StoreOwnProps>(Component: FC<OwnProps & CollectedProps>) => FC<OwnProps & CollectedProps>;

// export function glueStore<
//   Store extends SceneStore<CollectedProps, StoreOwnProps>,
//   CollectedProps extends Record<string, any> = Record<string, any>,
//   StoreOwnProps extends Record<string, any> = Record<string, any>,
// >(store: Store): StoreHocFn<StoreOwnProps, CollectedProps> {
//   const StoreContext = createContext(store);
//   const StoreProvider = StoreContext.Provider;

//   const useStore = (): Store => useContext(StoreContext);
//   const useNewStore = (): Store => useMemo(() => store, []);

//   return function storeHOC<OwnProps extends StoreOwnProps>(Component: FC<OwnProps & CollectedProps>): FC<OwnProps> {
//     const ObservableComponent = observer((props: OwnProps): ReactElement => {
//       const componentStore = useStore();

//       return <Component {...props} {...componentStore.collectProps(props)} />;
//     });

//     return function GluedComponent(props: OwnProps): ReactElement {
//       const componentStore = useNewStore();

//       return (
//         <StoreProvider value={componentStore}>
//           <ObservableComponent {...props} />
//         </StoreProvider>
//       );
//     };
//   };
// }

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

  // return function storeHOC<OwnProps extends StoreOwnProps>(Component: FC<OwnProps & CollectedProps>): FC<OwnProps> {
  //   const ObservableComponent = observer((props: OwnProps): ReactElement => {
  //     const componentStore = useStore();

  //     return <Component {...props} {...componentStore.collectProps(props)} />;
  //   });

  //   return function GluedComponent(props: OwnProps): ReactElement {
  //     const componentStore = useNewStore();

  //     return (
  //       <StoreProvider value={componentStore}>
  //         <ObservableComponent {...props} />
  //       </StoreProvider>
  //     );
  //   };
  // };
}
