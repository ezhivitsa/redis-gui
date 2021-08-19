import React, { ReactElement, ReactNode, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { isEqual } from 'lodash';
import { faChevronRight, faDatabase, faLayerGroup, faKey, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useStyles } from 'lib/theme';

import { ConnectionData } from 'stores';

import { ButtonIcon, ButtonIconView } from 'ui/button-icon';
import { Spinner, SpinnerSize } from 'ui/spinner';

import { Props, IconType, ConnectionLoadingData } from './types';

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
  const loadingData = store.getLoadingData(redis);
  const { currentKey, isDeletingKey } = store;

  useEffect(() => {
    store.setRedis(redis);

    return () => {
      store.dispose(redis);
    };
  }, []);

  function handleToggleOpenPrefix(prefix: string[], currentOpen?: boolean): void {
    if (currentOpen) {
      store.close(redis, prefix);
    } else {
      store.open(redis, prefix);
    }
  }

  function handleKeySelect(prefix: string[], key: string): void {
    store.setCurrentKey(redis, [...prefix, key]);
  }

  function handleDeleteKeyClick(prefix: string[], key: string): void {
    store.deleteKey(redis, prefix, key);
  }

  function renderIcon(connectionData?: ConnectionLoadingData, iconType?: IconType): ReactNode {
    if (connectionData?.isLoading) {
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

  function renderKeyActions(prefix: string[], key: string): ReactNode {
    return (
      <ButtonIcon
        view={ButtonIconView.Danger}
        icon={faTrash}
        size="sm"
        onClick={() => handleDeleteKeyClick(prefix, key)}
        disabled={isDeletingKey}
        className={cn('delete-btn')}
      />
    );
  }

  function renderKey(prefix: string[], key: string): ReactNode {
    const selected = isEqual(currentKey, [...prefix, key]);

    return (
      <div className={cn('key', { selected })} onDoubleClick={() => handleKeySelect(prefix, key)}>
        <FontAwesomeIcon icon={mapTypeToIcon[IconType.Key]} size="sm" />

        <span className={cn('name', { selected })} title={key}>
          {key}
        </span>

        {selected && renderKeyActions(prefix, key)}
      </div>
    );
  }

  function renderDataContent(
    prefix: string[],
    connectionData?: ConnectionData,
    loadingData?: ConnectionLoadingData,
  ): ReactNode {
    return (
      <div className={cn('content')}>
        {Object.keys(connectionData?.prefixes || {}).map((key) => (
          <div key={key} className={cn('data-item')}>
            {renderData([...prefix, key], key, connectionData?.prefixes[key], loadingData?.prefixes[key])}
          </div>
        ))}

        {connectionData?.keys.map((key) => (
          <div className={cn('data-item')} key={key}>
            {renderKey(prefix, key)}
          </div>
        ))}
      </div>
    );
  }

  function renderData(
    prefix: string[],
    name: string,
    connectionData?: ConnectionData,
    loadingData?: ConnectionLoadingData,
    iconType?: IconType,
  ): ReactNode {
    return (
      <>
        <div className={cn('connection')}>
          <ButtonIcon
            icon={faChevronRight}
            className={cn('arrow-icon', { open: connectionData?.open })}
            onClick={() => handleToggleOpenPrefix(prefix, connectionData?.open)}
          />

          {renderIcon(loadingData, iconType)}

          <span className={cn('name')} title={name}>
            {name}
          </span>
        </div>

        {connectionData?.open && !loadingData?.isLoading && renderDataContent(prefix, connectionData, loadingData)}
      </>
    );
  }

  return <div className={cn()}>{renderData([], redis.name, data, loadingData, IconType.Database)}</div>;
});
