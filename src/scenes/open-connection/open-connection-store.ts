import { action, observable, runInAction, computed, makeObservable } from 'mobx';

import { Redis } from 'lib/redis';

import { ConnectionData } from './types';

export class OpenConnectionStore {
  @observable
  private _redis?: Redis;

  @observable
  private _data: ConnectionData = {
    isLoading: false,
    open: false,
    keys: [],
    prefixes: {},
  };

  constructor() {
    makeObservable(this);
  }

  private _getPrefixData(prefix: string[]): ConnectionData {
    let data = this._data;

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

  @computed
  get data(): ConnectionData {
    return this._data;
  }

  @action
  setRedis(redis: Redis): void {
    this._redis = redis;
  }

  @action
  async getPrefixesAndKeys(prefix: string[]): Promise<void> {
    if (!this._redis) {
      return;
    }

    const { keys, prefixes } = await this._redis.getPrefixesAndKeys(prefix);
    console.log(keys, prefixes);
    const data = this._getPrefixData(prefix);

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
  toggleOpen(prefix: string[]): void {
    const data = this._getPrefixData(prefix);

    if (data.open) {
      data.open = false;
      data.keys = [];
      data.prefixes = {};
    } else {
      data.open = true;
      this.getPrefixesAndKeys(prefix);
    }
  }

  @action
  dispose(): void {
    this._data = {
      isLoading: false,
      open: false,
      keys: [],
      prefixes: {},
    };
    this._redis = undefined;
  }
}
