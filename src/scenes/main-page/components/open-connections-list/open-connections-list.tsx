import React, { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';

import { useStyles } from 'lib/theme';

import { useStore } from 'scenes/main-page';
import { OpenConnection } from 'scenes/open-connection';

import styles from './open-connections-list.pcss';

export const OpenConnectionsList = observer((): ReactElement => {
  const cn = useStyles(styles, 'open-connections-list');

  const store = useStore();
  const { openConnections } = store;

  return (
    <div className={cn()}>
      {openConnections.map((connection, index) => (
        <OpenConnection key={index} redis={connection} />
      ))}
    </div>
  );
});
