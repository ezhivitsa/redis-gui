import { action, observable, runInAction, makeObservable, computed } from 'mobx';
import { uniq } from 'lodash';

import { Redis, KeyData } from 'lib/redis';
import { listToKey, keyToList, hasPrefix } from 'lib/key';

import { ValueTabsStore } from './value-tabs-store';

export interface ConnectionData {
  open: boolean;
  keys: string[];
  prefixes: {
    [prefix: string]: ConnectionData;
  };
}
interface Deps {
  valueTabsStore: ValueTabsStore;
}

export class ConnectionDataStore {
  private _valueTabsStore: ValueTabsStore;
  private _redis: Redis;

  @observable
  private _data: ConnectionData = {
    open: false,
    keys: [],
    prefixes: {},
  };

  constructor(valueTabsStore: ValueTabsStore, redis: Redis) {
    this._valueTabsStore = valueTabsStore;
    this._redis = redis;

    makeObservable(this);
  }

  @computed
  get data(): ConnectionData {
    return this._data;
  }

  private _getPrefixData(prefix: string[]): ConnectionData {
    let data = this._data;

    for (let i = 0; i < prefix.length; i += 1) {
      if (!data.prefixes[prefix[i]]) {
        data.prefixes[prefix[i]] = {
          open: false,
          keys: [],
          prefixes: {},
        };
      }

      data = data.prefixes[prefix[i]];
    }

    return data;
  }

  private _cleanData(prefix: string[]): void {
    const data = this._getPrefixData(prefix);

    Object.keys(data.prefixes).map((prefixKey) => {
      const d = data.prefixes[prefixKey];

      if (d.keys.length === 0 && Object.keys(d.prefixes).length === 0) {
        delete data.prefixes[prefixKey];
      }
    });
  }

  selectKey(prefix: string[]): void {
    this._valueTabsStore.setActiveTab(this._redis.id, prefix);
  }

  resetKey(): void {
    this._valueTabsStore.removeActiveTab();
    this._valueTabsStore.setActiveData();
  }

  getKeyData(prefix: string[]): Promise<KeyData | undefined> {
    return this._redis.getKeyData(prefix);
  }

  async setKeyData(keyData: KeyData): Promise<void> {
    await this._redis.setKeyData(keyData);

    if (hasPrefix(keyData.key)) {
      const prefix = keyToList(keyData.key);
      await this.getPrefixesAndKeys([prefix[0]]);

      runInAction(() => {
        for (let i = 1; i < prefix.length; i += 1) {
          const p = prefix.slice(0, prefix.length - i);
          const d = this._getPrefixData(p);

          d.open = true;
        }
      });
    } else {
      const data = this._getPrefixData([]);

      runInAction(() => {
        data.keys = uniq([...data.keys, keyData.key]).sort();
      });
    }

    this._valueTabsStore.setActiveTab(this._redis.id, keyToList(keyData.key));
  }

  @action
  open(prefix: string[]): void {
    const data = this._getPrefixData(prefix);
    data.open = true;
  }

  @action
  close(prefix: string[]): void {
    const data = this._getPrefixData(prefix);
    data.open = false;
    data.keys = [];
    data.prefixes = {};
  }

  @action
  async getPrefixesAndKeys(prefix: string[]): Promise<void> {
    const { keys, prefixes } = await this._redis.getPrefixesAndKeys(prefix);
    const data = this._getPrefixData(prefix);

    runInAction(() => {
      Object.keys(prefixes).forEach((prefixKey) => {
        const prefixData = this._getPrefixData([...prefix, ...keyToList(prefixKey)]);
        prefixData.keys = prefixes[prefixKey];
      });

      data.keys = keys;
    });
  }

  @action
  async deleteKey(prefix: string[], key?: string): Promise<void> {
    await this._redis.deleteKey(listToKey(key ? [...prefix, key] : prefix));

    this._valueTabsStore.removeActiveTab(true);
    this._valueTabsStore.setActiveData();

    runInAction(() => {
      const data = this._getPrefixData(prefix);
      data.keys = data.keys.filter((k) => k !== key);

      for (let i = 0; i <= prefix.length; i += 1) {
        const p = prefix.slice(0, prefix.length - i);
        this._cleanData(p);
      }
    });
  }

  selectPrefix(prefix: string[]): void {
    this._valueTabsStore.setSelectedPrefix(this._redis.id, prefix);
  }
}

export class ConnectionsDataStore {
  private _valueTabsStore: ValueTabsStore;

  @observable
  private _redisData: Record<string, ConnectionDataStore> = {};

  constructor({ valueTabsStore }: Deps) {
    this._valueTabsStore = valueTabsStore;

    makeObservable(this);
  }

  getConnectionDataStore(redisId?: string): ConnectionDataStore | undefined {
    return redisId ? this._redisData[redisId] : undefined;
  }

  @action
  setRedis(redis: Redis): ConnectionDataStore {
    const connectionDataStore = new ConnectionDataStore(this._valueTabsStore, redis);
    this._redisData[redis.id] = connectionDataStore;

    return connectionDataStore;
  }

  @action
  disposeRedis(redis: Redis): void {
    delete this._redisData[redis.id];
  }
}
