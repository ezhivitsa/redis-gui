import { action, observable, runInAction, computed } from 'mobx';

import { Redis } from 'lib/redis';

import { ConnectionData } from './types';

const PREFIX_SEPARATOR = ':';

export class OpenConnectionStore {
  @observable
  private _redis?: Redis;

  @observable
  private _data: ConnectionData = {};

  @observable
  private _openPrefixes = new Set<string>();

  @observable
  private _loadingPrefixes = new Set<string>();

  private _getPrefixData(prefix: string[]): ConnectionData {
    let data = this._data;

    for (let i = 0; i < prefix.length; i += 1) {
      if (!data[prefix[i]]) {
        data[prefix[i]] = {};
      }

      data = data[prefix[i]] as ConnectionData;
    }

    return data;
  }

  @computed
  get data(): ConnectionData {
    return this._data;
  }

  isLoadingPrefix(prefix: string[]): boolean {
    return this._loadingPrefixes.has(prefix.join(PREFIX_SEPARATOR));
  }

  isPrefixOpen(prefix: string[]): boolean {
    return this._openPrefixes.has(prefix.join(PREFIX_SEPARATOR));
  }

  @action
  setRedis(redis: Redis): void {
    this._redis = redis;
  }

  @action
  openPrefix(prefix: string[]): void {
    this._openPrefixes.add(prefix.join(PREFIX_SEPARATOR));
  }

  @action
  closePrefix(prefix: string[]): void {
    this._openPrefixes.delete(prefix.join(PREFIX_SEPARATOR));
  }

  @action
  async getPrefixesAndKeys(prefix: string[]): Promise<void> {
    if (!this._redis) {
      return;
    }

    const prefixStr = prefix.join(PREFIX_SEPARATOR);
    this._loadingPrefixes.add(prefixStr);

    const { keys, prefixes } = await this._redis.getPrefixesAndKeys(prefix);

    const data = this._getPrefixData(prefix);

    runInAction(() => {
      data.open = true;

      for (let i = 0; i < prefixes.length; i += 1) {
        data[prefixes[i]] = {};
      }

      for (let i = 0; i < keys.length; i += 1) {
        data[keys[i]] = true;
      }

      this._loadingPrefixes.delete(prefixStr);
    });
  }

  @action
  dispose(): void {
    this._loadingPrefixes.clear();
    this._data = {};
    this._redis = undefined;
  }
}
