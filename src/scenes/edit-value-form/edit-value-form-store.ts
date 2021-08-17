import { observable, makeObservable, computed, action, runInAction } from 'mobx';

import { ConnectionDataStore } from 'stores';

import { KeyData } from 'lib/redis';

interface Deps {
  connectionDataStore: ConnectionDataStore;
}
export class EditValueFormStore {
  @observable
  private _connectionDataStore: ConnectionDataStore;

  @observable
  private _data?: KeyData;

  @observable
  private _isLoading = false;

  constructor({ connectionDataStore }: Deps) {
    this._connectionDataStore = connectionDataStore;

    makeObservable(this);
  }

  @computed
  get currentKey(): string[] | undefined {
    return this._connectionDataStore.currentKey?.prefix;
  }

  @computed
  get currentRedisId(): string | undefined {
    return this._connectionDataStore.currentKey?.redisId;
  }

  @computed
  get isLoading(): boolean {
    return this._isLoading;
  }

  @computed
  get keyData(): KeyData | undefined {
    return this._data;
  }

  @action
  async getKeyData(): Promise<void> {
    const prefix = this.currentKey;
    const redis = this._connectionDataStore.getCurrentRedis();
    if (!redis) {
      return;
    }

    this._isLoading = true;

    const data = await redis.getKeyData(prefix);

    runInAction(() => {
      this._isLoading = false;
      this._data = data;
    });
  }
}
