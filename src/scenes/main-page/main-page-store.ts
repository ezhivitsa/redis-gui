import { makeObservable, observable, action, computed, runInAction } from 'mobx';

import { Redis } from 'lib/redis';

import { ValueTabsStore, ConnectionsDataStore, ConnectionDataStore } from 'stores';

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

  cancelActiveKey(): void {
    const dataStore = this._dataStore;
    if (!dataStore) {
      return;
    }

    dataStore.resetKey();
  }
}
