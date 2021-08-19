import { action, observable, runInAction, makeObservable, computed } from 'mobx';

import { Redis } from 'lib/redis';

export interface ConnectionData {
  open: boolean;
  keys: string[];
  prefixes: {
    [prefix: string]: ConnectionData;
  };
}

interface RedisData {
  redis: Redis;
  data: ConnectionData;
}

interface KeyData {
  redisId: string;
  prefix: string[];
}

export class ConnectionDataStore {
  @observable
  private _redisData: Record<string, RedisData> = {};

  @observable
  private _currentKey?: KeyData;

  constructor() {
    makeObservable(this);
  }

  private _getPrefixData(redis: Redis, prefix: string[]): ConnectionData {
    let data = this.getData(redis);

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

  getData(redis: Redis): ConnectionData {
    return (
      this._redisData[redis.id]?.data || {
        open: false,
        keys: [],
        prefixes: {},
      }
    );
  }

  getCurrentRedis(): Redis | undefined {
    const redisId = this._currentKey?.redisId;
    if (redisId === undefined) {
      return;
    }

    return this._redisData[redisId].redis;
  }

  getRedis(redisId: string): Redis | undefined {
    return this._redisData[redisId].redis;
  }

  @computed
  get currentKey(): KeyData | undefined {
    return this._currentKey;
  }

  @action
  setRedis(redis: Redis): void {
    this._redisData[redis.id] = {
      redis,
      data: {
        open: false,
        keys: [],
        prefixes: {},
      },
    };
  }

  @action
  setCurrentKey(redis: Redis, prefix: string[]): void {
    this._currentKey = { redisId: redis.id, prefix };
  }

  @action
  async getPrefixesAndKeys(redis: Redis, prefix: string[]): Promise<string[]> {
    if (!this._redisData[redis.id].redis) {
      return [];
    }

    const { keys, prefixes } = await redis.getPrefixesAndKeys(prefix);
    const data = this._getPrefixData(redis, prefix);

    runInAction(() => {
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
  deleteKey(redis: Redis, prefix: string[], key: string): void {}

  @action
  open(redis: Redis, prefix: string[]): void {
    const data = this._getPrefixData(redis, prefix);
    data.open = true;
  }

  @action
  close(redis: Redis, prefix: string[]): void {
    const data = this._getPrefixData(redis, prefix);
    data.open = false;
    data.keys = [];
    data.prefixes = {};
  }

  @action
  disposeRedis(redis: Redis): void {
    delete this._redisData[redis.id];
  }

  @action
  dispose(): void {
    this._currentKey = undefined;
  }
}
