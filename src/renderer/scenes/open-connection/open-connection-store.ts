import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { listToKey } from 'lib/key';

import { Redis } from 'renderer/lib/redis';

import { ConnectionData, ConnectionDataStore, ConnectionsDataStore, ValueTabsStore } from 'renderer/stores';

interface Deps {
  connectionsDataStore: ConnectionsDataStore;
  valueTabsStore: ValueTabsStore;
}

class OpenConnectionStore {
  private _valueTabsStore: ValueTabsStore;
  private _connectionDataStore: ConnectionDataStore;
  private _redisId: string;

  @observable
  private _loadingKeys = new Set<string>();

  @observable
  private _isDeletingKey = false;

  constructor(redisId: string, valueTabsStore: ValueTabsStore, connectionDataStore: ConnectionDataStore) {
    this._valueTabsStore = valueTabsStore;
    this._connectionDataStore = connectionDataStore;
    this._redisId = redisId;

    makeObservable(this);
  }

  @computed
  get isDeletingKey(): boolean {
    return this._isDeletingKey;
  }

  @computed
  get data(): ConnectionData {
    return this._connectionDataStore.data;
  }

  isLoadingKey(prefix: string[]): boolean {
    return this._loadingKeys.has(listToKey(prefix));
  }

  isActiveKey(prefix: string[]): boolean {
    const activeTab = this._valueTabsStore.activeTab;

    return (
      activeTab !== undefined &&
      activeTab.redisId === this._redisId &&
      listToKey(prefix) === listToKey(activeTab.prefix)
    );
  }

  isSelectedPrefix(prefix: string[]): boolean {
    const selectedPrefix = this._valueTabsStore.selectedPrefix;

    return (
      selectedPrefix !== undefined &&
      selectedPrefix.redisId === this._redisId &&
      listToKey(prefix) === listToKey(selectedPrefix.prefix)
    );
  }

  @action
  open(prefix: string[]): void {
    this._connectionDataStore.open(prefix);
    this.getPrefixesAndKeys(prefix);
  }

  @action
  async getPrefixesAndKeys(prefix: string[]): Promise<void> {
    const key = listToKey(prefix);
    this._loadingKeys.add(key);

    await this._connectionDataStore.getPrefixesAndKeys(prefix);

    runInAction(() => {
      this._loadingKeys.delete(key);
    });
  }

  @action
  close(prefix: string[]): void {
    this._connectionDataStore.close(prefix);
  }

  @action
  setCurrentKey(prefix: string[]): void {
    this._connectionDataStore.selectKey(prefix);
  }

  resetCurrentKey(): void {
    this._connectionDataStore.resetKey();
  }

  @action
  async deleteKey(prefix: string[], key: string): Promise<void> {
    this._isDeletingKey = true;

    await this._connectionDataStore.deleteKey(prefix, key);

    runInAction(() => {
      this._isDeletingKey = false;
    });
  }

  selectPrefix(prefix: string[]): void {
    this._connectionDataStore.selectPrefix(prefix);
  }
}

export class OpenConnectionsStore {
  @observable
  private _redisData: Record<string, OpenConnectionStore> = {};

  private _connectionsDataStore: ConnectionsDataStore;
  private _valueTabsStore: ValueTabsStore;

  constructor({ connectionsDataStore, valueTabsStore }: Deps) {
    this._connectionsDataStore = connectionsDataStore;
    this._valueTabsStore = valueTabsStore;

    makeObservable(this);
  }

  @action
  getDataStore(redis: Redis): OpenConnectionStore {
    let store = this._redisData[redis.id];

    if (!store) {
      const connectionDataStore = this._connectionsDataStore.setRedis(redis);
      store = this._redisData[redis.id] = new OpenConnectionStore(redis.id, this._valueTabsStore, connectionDataStore);
    }

    return store;
  }

  @action
  dispose(redis: Redis): void {
    delete this._redisData[redis.id];

    this._connectionsDataStore.disposeRedis(redis);
    this._valueTabsStore.dispose();
  }
}
