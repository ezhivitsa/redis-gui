import { action, observable, runInAction, makeObservable, computed } from 'mobx';

import { Redis } from 'lib/redis';
import { listToKey } from 'lib/key';

import { ConnectionsDataStore, ConnectionDataStore, ValueTabsStore } from 'stores';

interface Deps {
  connectionsDataStore: ConnectionsDataStore;
  valueTabsStore: ValueTabsStore;
}

class OpenConnectionStore {
  private _valueTabsStore: ValueTabsStore;
  private _connectionDataStore: ConnectionDataStore;

  private _loadingKeys = new Set<string>();

  @observable
  private _isDeletingKey = false;

  constructor(valueTabsStore: ValueTabsStore, connectionDataStore: ConnectionDataStore) {
    this._valueTabsStore = valueTabsStore;
    this._connectionDataStore = connectionDataStore;
  }

  @computed
  get isDeletingKey(): boolean {
    return this._isDeletingKey;
  }

  isLoadingKey(prefix: string[]): boolean {
    return this._loadingKeys.has(listToKey(prefix));
  }

  isActiveKey(prefix: string[]): boolean {
    const activeTab = this._valueTabsStore.activeTab;
    return activeTab !== undefined && listToKey(prefix) === listToKey(activeTab.prefix);
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

  @action
  async deleteKey(prefix: string[], key: string): Promise<void> {
    this._isDeletingKey = true;

    await this._connectionDataStore.deleteKey(prefix, key);

    runInAction(() => {
      this._isDeletingKey = false;
    });
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

  // private _getPrefixData(redis: Redis, prefix: string[]): ConnectionLoadingData {
  //   let data = this.getLoadingData(redis);

  //   for (let i = 0; i < prefix.length; i += 1) {
  //     if (!data.prefixes[prefix[i]]) {
  //       data.prefixes[prefix[i]] = {
  //         isLoading: false,
  //         prefixes: {},
  //       };
  //     }

  //     data = data.prefixes[prefix[i]];
  //   }

  //   return data;
  // }

  // getLoadingData(redis: Redis): ConnectionLoadingData {
  //   return (
  //     this._redisData[redis.id]?.data || {
  //       isLoading: false,
  //       prefixes: {},
  //     }
  //   );
  // }

  // getData(redis: Redis): ConnectionData {
  //   return this._connectionDataStore.getData(redis);
  // }

  // @computed
  // get currentKey(): string[] | undefined {
  //   return this._connectionDataStore.currentKey?.prefix;
  // }

  @action
  setRedis(redis: Redis): void {
    const connectionDataStore = this._connectionsDataStore.setRedis(redis);
    this._redisData[redis.id] = new OpenConnectionStore(this._valueTabsStore, connectionDataStore);
  }

  @action
  dispose(redis: Redis): void {
    delete this._redisData[redis.id];

    this._connectionsDataStore.disposeRedis(redis);
    this._valueTabsStore.dispose();
  }
}
