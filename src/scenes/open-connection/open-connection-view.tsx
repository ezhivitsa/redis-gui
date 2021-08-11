import React, { ReactElement, ReactNode, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { faChevronRight, faDatabase, faLayerGroup, faKey } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

  function handleToggleOpenPrefix(prefix: string[]): void {
    store.toggleOpen(prefix);
  }

  function renderIcon(connectionData: ConnectionData, iconType?: IconType): ReactNode {
    if (connectionData.isLoading) {
      return <Spinner size={SpinnerSize.XS} />;
    }

    let type = iconType;

    if (!type) {
      type = IconType.Prefix;
    }

    if (type) {
      return <FontAwesomeIcon icon={mapTypeToIcon[type]} size="sm" />;
    }

    return null;
  }

  return (
    <div className={cn()}>
      <div className={cn('connection')}>
        <ButtonIcon
          icon={faChevronRight}
          className={cn('arrow-icon', { open: data.open })}
          onClick={() => handleToggleOpenPrefix([])}
        />

        {renderIcon(data, IconType.Database)}

        <span className={cn('name')} title={redis.name}>
          {redis.name}
        </span>
      </div>
    </div>
  );
});
