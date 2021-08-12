import { action, observable, runInAction, computed, makeObservable } from 'mobx';

import { Redis } from 'lib/redis';

import { ConnectionData } from './types';

interface RedisData {
  redis: Redis;
  data: ConnectionData;
}

export class OpenConnectionStore {
  @observable
  private _redisData: Record<string, RedisData> = {};

  constructor() {
    makeObservable(this);
  }

  private _getPrefixData(redis: Redis, prefix: string[]): ConnectionData {
    let data = this.getData(redis);

    for (let i = 0; i < prefix.length; i += 1) {
      if (!data.prefixes[prefix[i]]) {
        data.prefixes[prefix[i]] = {
          isLoading: false,
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
        isLoading: false,
        open: false,
        keys: [],
        prefixes: {},
      }
    );
  }

  @action
  setRedis(redis: Redis): void {
    this._redisData[redis.id] = {
      redis,
      data: {
        isLoading: false,
        open: false,
        keys: [],
        prefixes: {},
      },
    };
  }

  @action
  async getPrefixesAndKeys(redis: Redis, prefix: string[]): Promise<void> {
    if (!this._redisData[redis.id].redis) {
      return;
    }

    const { keys, prefixes } = await redis.getPrefixesAndKeys(prefix);
    const data = this._getPrefixData(redis, prefix);

    runInAction(() => {
      data.isLoading = true;
      data.open = true;

      for (let i = 0; i < prefixes.length; i += 1) {
        data.prefixes[prefixes[i]] = {
          isLoading: false,
          open: false,
          keys: [],
          prefixes: {},
        };
      }

      data.keys = keys;
      data.isLoading = false;
    });
  }

  @action
  toggleOpen(redis: Redis, prefix: string[]): void {
    const data = this._getPrefixData(redis, prefix);

    if (data.open) {
      data.open = false;
      data.keys = [];
      data.prefixes = {};
    } else {
      data.open = true;
      this.getPrefixesAndKeys(redis, prefix);
    }
  }

  @action
  dispose(redis: Redis): void {
    delete this._redisData[redis.id];
  }
}
