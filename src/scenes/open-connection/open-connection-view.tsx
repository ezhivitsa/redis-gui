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
  const data = store.getData(redis);

  useEffect(() => {
    store.setRedis(redis);

    return () => {
      store.dispose(redis);
    };
  }, []);

  function handleToggleOpenPrefix(prefix: string[]): void {
    store.toggleOpen(redis, prefix);
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

  function renderKey(key: string): ReactNode {
    return (
      <div className={cn('key')}>
        <FontAwesomeIcon icon={mapTypeToIcon[IconType.Key]} size="sm" />

        <span className={cn('name')} title={key}>
          {key}
        </span>
      </div>
    );
  }

  function renderDataContent(prefix: string[], connectionData: ConnectionData): ReactNode {
    return (
      <div className={cn('content')}>
        {Object.keys(connectionData.prefixes).map((key) => (
          <div key={key} className={cn('data-item')}>
            {renderData([...prefix, key], key, connectionData.prefixes[key])}
          </div>
        ))}

        {connectionData.keys.map((key) => (
          <div className={cn('data-item')} key={key}>
            {renderKey(key)}
          </div>
        ))}
      </div>
    );
  }

  function renderData(prefix: string[], name: string, connectionData: ConnectionData, iconType?: IconType): ReactNode {
    return (
      <>
        <div className={cn('connection')}>
          <ButtonIcon
            icon={faChevronRight}
            className={cn('arrow-icon', { open: connectionData.open })}
            onClick={() => handleToggleOpenPrefix(prefix)}
          />

          {renderIcon(connectionData, iconType)}

          <span className={cn('name')} title={name}>
            {name}
          </span>
        </div>

        {connectionData.open && renderDataContent(prefix, connectionData)}
      </>
    );
  }

  return <div className={cn()}>{renderData([], redis.name, data, IconType.Database)}</div>;
});
