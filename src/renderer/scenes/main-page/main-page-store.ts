import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { Redis } from 'renderer/lib/redis';

import { ConnectionDataStore, ConnectionsDataStore, ValueTabsStore } from 'renderer/stores';

interface Deps {
  valueTabsStore: ValueTabsStore;
  connectionsDataStore: ConnectionsDataStore;
}

export class MainPageStore {
  private _valueTabsStore: ValueTabsStore;
  private _connectionsDataStore: ConnectionsDataStore;
  @observable
  private _connectionsListOpened = false;

  @observable
  private _openConnections: Redis[] = [];

  @observable
  private _isDeleting = false;

  @observable
  private _isDisconnecting = false;

  constructor({ valueTabsStore, connectionsDataStore }: Deps) {
    this._valueTabsStore = valueTabsStore;
    this._connectionsDataStore = connectionsDataStore;

    makeObservable(this);
  }

  @computed
  get hasActiveTab(): boolean {
    return Boolean(this._valueTabsStore.activeTab);
  }

  @computed
  get hasSelectedItem(): boolean {
    return Boolean(this._valueTabsStore.selectedPrefix);
  }

  @computed
  get connectionsListOpened(): boolean {
    return this._connectionsListOpened;
  }

  private get _dataStore(): ConnectionDataStore | undefined {
    const activeTab = this._valueTabsStore.activeTab;
    return this._connectionsDataStore.getConnectionDataStore(activeTab?.redisId);
  }

  @computed
  get openConnections(): Redis[] {
    return this._openConnections;
  }

  @computed
  get isDeleting(): boolean {
    return this._isDeleting;
  }

  @computed
  get isDisconnecting(): boolean {
    return this._isDisconnecting;
  }

  @action
  setConnectionsListOpened(opened: boolean): void {
    this._connectionsListOpened = opened;
  }

  @action
  addOpenConnection(redis: Redis): void {
    this._openConnections.push(redis);
  }

  async deleteActiveKey(): Promise<void> {
    const activeTab = this._valueTabsStore.activeTab;
    const dataStore = this._dataStore;

    if (!dataStore || !activeTab) {
      return;
    }

    this._isDeleting = true;

    await dataStore.deleteKey(activeTab.prefix);

    runInAction(() => {
      this._isDeleting = false;
    });
  }

  @action
  async disconnectConnection(): Promise<void> {
    const selectedPrefix = this._valueTabsStore.selectedPrefix;
    const redisId = selectedPrefix?.redisId;
    const dataStore = this._connectionsDataStore.getConnectionDataStore(redisId);

    if (!dataStore || !redisId) {
      return;
    }

    this._isDisconnecting = true;

    await dataStore.disconnect();

    this._valueTabsStore.removeSelectedPrefix();

    runInAction(() => {
      this._isDisconnecting = false;
      this._openConnections = this._openConnections.filter((redis) => redis.id !== redisId);
    });
  }

  cancelActiveKey(): void {
    const dataStore = this._dataStore;
    if (!dataStore) {
      return;
    }

    dataStore.resetKey();
  }
}
