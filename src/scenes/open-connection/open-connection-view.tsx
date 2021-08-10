import React, { ReactElement, ReactNode, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { faChevronRight, faDatabase, faLayerGroup, faKey } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { useStyles } from 'lib/theme';

import { ButtonIcon } from 'ui/button-icon';
import { Spinner, SpinnerSize } from 'ui/spinner';

import { Props, IconType, ConnectionData } from './types';

import { useStore } from './index';

import styles from './open-connection.pcss';

const mapTypeToIcon: Record<IconType, IconProp> = {
  [IconType.Database]: faDatabase,
  [IconType.Prefix]: faLayerGroup,
  [IconType.Key]: faKey,
};

export const OpenConnectionView = observer(({ redis }: Props): ReactElement => {
  const cn = useStyles(styles, 'open-connection');

  const store = useStore();
  const { data } = store;

  useEffect(() => {
    store.setRedis(redis);

    return () => {
      store.dispose();
    };
  }, []);

  function renderIcon(connectionData: ConnectionData | true, prefix: string[], iconType?: IconType): ReactNode {
    if (store.isLoadingPrefix(prefix)) {
      return <Spinner size={SpinnerSize.M} />;
    }

    let type = iconType;

    if (!type) {
      if (connectionData === true) {
        type = IconType.Key;
      } else {
        type = IconType.Prefix;
      }
    }

    if (type) {
      return <ButtonIcon icon={mapTypeToIcon[type]} />;
    }

    return null;
  }

  return (
    <div>
      <div className={cn('connection')}>
        <ButtonIcon icon={faChevronRight} className={cn('arrow-icon', { open: store.isPrefixOpen([]) })} />
        {renderIcon(data, [], IconType.Database)}
        <span>{redis.name}</span>
      </div>
    </div>
  );
});
