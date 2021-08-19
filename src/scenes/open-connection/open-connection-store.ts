import { action, observable, runInAction, makeObservable, computed } from 'mobx';

import { Redis } from 'lib/redis';

import { ConnectionDataStore, ConnectionData } from 'stores';

import { REDIS_PREFIX_SEPARATOR } from 'constants/app-constants';

import { ConnectionLoadingData } from './types';

interface RedisData {
  redis: Redis;
  data: ConnectionLoadingData;
}

interface Deps {
  connectionDataStore: ConnectionDataStore;
}

export class OpenConnectionStore {
  @observable
  private _redisData: Record<string, RedisData> = {};

  @observable
  private _connectionDataStore: ConnectionDataStore;

  @observable
  private _isDeletingKey = false;

  constructor({ connectionDataStore }: Deps) {
    this._connectionDataStore = connectionDataStore;

    makeObservable(this);
  }

  private _getPrefixData(redis: Redis, prefix: string[]): ConnectionLoadingData {
    let data = this.getLoadingData(redis);

    for (let i = 0; i < prefix.length; i += 1) {
      if (!data.prefixes[prefix[i]]) {
        data.prefixes[prefix[i]] = {
          isLoading: false,
          prefixes: {},
        };
      }

      data = data.prefixes[prefix[i]];
    }

    return data;
  }

  getLoadingData(redis: Redis): ConnectionLoadingData {
    return (
      this._redisData[redis.id]?.data || {
        isLoading: false,
        prefixes: {},
      }
    );
  }

  getData(redis: Redis): ConnectionData {
    return this._connectionDataStore.getData(redis);
  }

  @computed
  get currentKey(): string[] | undefined {
    return this._connectionDataStore.currentKey?.prefix;
  }

  @computed
  get isDeletingKey(): boolean {
    return this._isDeletingKey;
  }

  @action
  setRedis(redis: Redis): void {
    this._connectionDataStore.setRedis(redis);

    this._redisData[redis.id] = {
      redis,
      data: {
        isLoading: false,
        prefixes: {},
      },
    };
  }

  @action
  async getPrefixesAndKeys(redis: Redis, prefix: string[]): Promise<void> {
    const data = this._getPrefixData(redis, prefix);
    data.isLoading = true;

    const prefixes = await this._connectionDataStore.getPrefixesAndKeys(redis, prefix);

    runInAction(() => {
      data.isLoading = false;

      for (let i = 0; i < prefixes.length; i += 1) {
        data.prefixes[prefixes[i]] = {
          isLoading: false,
          prefixes: {},
        };
      }
    });
  }

  @action
  open(redis: Redis, prefix: string[]): void {
    this._connectionDataStore.open(redis, prefix);
    this.getPrefixesAndKeys(redis, prefix);
  }

  @action
  close(redis: Redis, prefix: string[]): void {
    this._connectionDataStore.close(redis, prefix);
  }

  @action
  setCurrentKey(redis: Redis, prefix: string[]): void {
    this._connectionDataStore.setCurrentKey(redis, prefix);
  }

  @action
  async deleteKey(redis: Redis, prefix: string[], key: string): Promise<void> {
    this._isDeletingKey = true;

    await redis.deleteKey([...prefix, key].join(REDIS_PREFIX_SEPARATOR));

    this._connectionDataStore.deleteKey(prefix, key);

    runInAction(() => {
      this._isDeletingKey = false;
    });
  }

  @action
  dispose(redis: Redis): void {
    delete this._redisData[redis.id];

    this._connectionDataStore.disposeRedis(redis);
    this._connectionDataStore.dispose();
  }
}
