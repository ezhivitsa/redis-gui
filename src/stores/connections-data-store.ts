import { action, observable, runInAction, makeObservable, computed } from 'mobx';

import { Redis } from 'lib/redis';

import { ValueTabsStore } from './value-tabs-store';

export interface ConnectionData {
  open: boolean;
  keys: string[];
  prefixes: {
    [prefix: string]: ConnectionData;
  };
}

interface KeyData {
  redisId: string;
  prefix: string[];
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

  selectKey(prefix: string[]): void {
    this._valueTabsStore.setActiveTab(this._redis.id, prefix);
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
  async getPrefixesAndKeys(prefix: string[]): Promise<string[]> {
    const { keys, prefixes } = await this._redis.getPrefixesAndKeys(prefix);
    const data = this._getPrefixData(prefix);

    runInAction(() => {
      // ToDo: check where it's required here
      data.open = true;

      for (let i = 0; i < prefixes.length; i += 1) {
        data.prefixes[prefixes[i]] = {
          open: false,
          keys: [],
          prefixes: {},
        };
      }

      data.keys = keys;
    });

    return prefixes;
  }

  @action
  async deleteKey(prefix: string[], key: string): Promise<void> {
    // await redis.deleteKey([...prefix, key].join(REDIS_PREFIX_SEPARATOR));
  }
}

export class ConnectionsDataStore {
  private _valueTabsStore: ValueTabsStore;

  @observable
  private _redisData: Record<string, ConnectionDataStore> = {};

  @observable
  private _currentKey?: KeyData;

  constructor({ valueTabsStore }: Deps) {
    this._valueTabsStore = valueTabsStore;

    makeObservable(this);
  }

  // getCurrentRedis(): Redis | undefined {
  //   const redisId = this._currentKey?.redisId;
  //   if (redisId === undefined) {
  //     return;
  //   }

  //   return this._redisData[redisId].redis;
  // }

  // getRedis(redisId: string): Redis | undefined {
  //   return this._redisData[redisId].redis;
  // }

  // @computed
  // get currentKey(): KeyData | undefined {
  //   return this._currentKey;
  // }

  @action
  setRedis(redis: Redis): ConnectionDataStore {
    const connectionDataStore = new ConnectionDataStore(this._valueTabsStore, redis);
    this._redisData[redis.id] = connectionDataStore;

    return connectionDataStore;
  }

  // @action
  // setCurrentKey(redis: Redis, prefix: string[]): void {
  //   this._currentKey = { redisId: redis.id, prefix };
  // }

  @action
  disposeRedis(redis: Redis): void {
    delete this._redisData[redis.id];
  }

  @action
  dispose(): void {
    this._currentKey = undefined;
  }
}
