import React, { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from 'scenes/main-page';

export const OpenConnectionsList = observer((): ReactElement => {
  const store = useStore();
  const { openConnections } = store;

  return <div></div>;
});
