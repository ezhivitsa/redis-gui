import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faChevronRight, faDatabase, faKey, faLayerGroup, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import { ReactElement, ReactNode, useEffect } from 'react';

import { handleEnterEvent } from 'renderer/lib/keyboard';
import { useStyles } from 'renderer/lib/theme';

import { ConnectionData } from 'renderer/stores';

import { ButtonIcon, ButtonIconView } from 'renderer/ui/button-icon';
import { Spinner, SpinnerSize } from 'renderer/ui/spinner';

import { useStore } from './index';
import { IconType, Props } from './types';

import styles from './open-connection.pcss';

const mapTypeToIcon: Record<IconType, IconProp> = {
  [IconType.Database]: faDatabase,
  [IconType.Prefix]: faLayerGroup,
  [IconType.Key]: faKey,
};

export const OpenConnectionView = observer(({ redis }: Props): ReactElement | null => {
  const cn = useStyles(styles, 'open-connection');

  const store = useStore();
  const dataStore = store.getDataStore(redis);

  const { isDeletingKey, data } = dataStore;

  useEffect(() => {
    return () => {
      store.dispose(redis);
    };
  }, []);

  function handleToggleOpenPrefix(prefix: string[], currentOpen?: boolean): void {
    if (currentOpen) {
      dataStore.close(prefix);
    } else {
      dataStore.open(prefix);
    }
  }

  function handleKeySelect(prefix: string[], key: string): void {
    const items = [...prefix, key];
    if (dataStore.isActiveKey(items)) {
      dataStore.resetCurrentKey();
    } else {
      dataStore.setCurrentKey(items);
    }
  }

  function handleDeleteKeyClick(prefix: string[], key: string): void {
    dataStore.deleteKey(prefix, key);
  }

  function handleSelectPrefix(prefix: string[]): void {
    dataStore.selectPrefix(prefix);
  }

  function renderIcon(prefix: string[], iconType?: IconType): ReactNode {
    if (dataStore.isLoadingKey(prefix)) {
      return <Spinner size={SpinnerSize.XS} />;
    }

    let type = iconType;

    if (!type) {
      type = IconType.Prefix;
    }

    if (type) {
      return <FontAwesomeIcon className={cn('icon')} icon={mapTypeToIcon[type]} size="sm" />;
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
    const itemPrefix = [...prefix, key];
    const active = dataStore.isActiveKey(itemPrefix);
    const selected = dataStore.isSelectedPrefix(itemPrefix);

    const clickHandler = (): void => handleSelectPrefix(itemPrefix);

    return (
      <div
        className={cn('key', { active, selected })}
        onDoubleClick={() => handleKeySelect(prefix, key)}
        onClick={clickHandler}
        role="button"
        tabIndex={0}
        onKeyDown={handleEnterEvent(clickHandler)}
      >
        <FontAwesomeIcon icon={mapTypeToIcon[IconType.Key]} size="sm" className={cn('icon')} />

        <span className={cn('name', { active })} title={key}>
          {key}
        </span>

        {active && renderKeyActions(prefix, key)}
      </div>
    );
  }

  function renderDataContent(prefix: string[], connectionData?: ConnectionData): ReactNode {
    return (
      <div className={cn('content')}>
        {Object.keys(connectionData?.prefixes || {}).map((key) => (
          <div key={key} className={cn('data-item')}>
            {renderData([...prefix, key], key, connectionData?.prefixes[key])}
          </div>
        ))}

        {connectionData?.keys.map((key) => (
          <div key={key} className={cn('data-item')}>
            {renderKey(prefix, key)}
          </div>
        ))}
      </div>
    );
  }

  function renderData(prefix: string[], name: string, connectionData?: ConnectionData, iconType?: IconType): ReactNode {
    const clickHandler = (): void => handleSelectPrefix(prefix);

    return (
      <>
        <div
          className={cn('connection', { selected: dataStore.isSelectedPrefix(prefix) })}
          role="button"
          tabIndex={0}
          onClick={clickHandler}
          onKeyDown={handleEnterEvent(clickHandler)}
        >
          <ButtonIcon
            icon={faChevronRight}
            className={cn('arrow-icon', { open: connectionData?.open })}
            onClick={() => handleToggleOpenPrefix(prefix, connectionData?.open)}
          />

          {renderIcon(prefix, iconType)}

          <span className={cn('name')} title={name}>
            {name}
          </span>
        </div>

        {connectionData?.open && !dataStore.isLoadingKey(prefix) && renderDataContent(prefix, connectionData)}
      </>
    );
  }

  return <div className={cn()}>{renderData([], redis.name, data, IconType.Database)}</div>;
});
