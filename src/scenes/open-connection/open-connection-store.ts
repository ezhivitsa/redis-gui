import { action, observable, runInAction } from 'mobx';

import { Redis } from 'lib/redis';

import { ConnectionData } from './types';

export class OpenConnectionStore {
  @observable
  private _redis?: Redis;

  @observable
  private _data: ConnectionData = {};

  @observable
  private _isLoadingPrefix?: string[];

  @action
  setRedis(redis: Redis): void {
    this._redis = redis;
  }

  @action
  async getPrefixesAndKeys(prefix: string[]): Promise<void> {
    if (!this._redis) {
      return;
    }

    this._isLoadingPrefix = prefix;

    const { keys, prefixes } = await this._redis.getPrefixesAndKeys(prefix);

    // const

    runInAction(() => {
      this._isLoadingPrefix = undefined;
    });
  }

  @action
  dispose(): void {
    this._isLoadingPrefix = undefined;
    this._data = {};
    this._redis = undefined;
  }
}
