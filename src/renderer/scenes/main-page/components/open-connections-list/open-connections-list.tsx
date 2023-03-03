import { observer } from 'mobx-react-lite';
import { ReactElement } from 'react';

import { useStyles } from 'renderer/lib/theme';

import { useStore } from 'renderer/scenes/main-page';
import { OpenConnection } from 'renderer/scenes/open-connection';

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
