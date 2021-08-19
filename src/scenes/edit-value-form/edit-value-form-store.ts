import { observable, makeObservable, computed, action, runInAction } from 'mobx';

import { ConnectionDataStore } from 'stores';

import { KeyData } from 'lib/redis';

import { EditDataValues } from './types';

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

  @observable
  private _isSaving = false;

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
  get isSaving(): boolean {
    return this._isSaving;
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

  @action
  async saveValue(values: EditDataValues): Promise<void> {
    const keyData = this._data;
    const redis = this._connectionDataStore.getRedis(values.redisId);

    if (!redis) {
      return;
    }

    this._isSaving = true;

    if (keyData && keyData?.key !== values.key) {
      await redis.deleteKey(keyData?.key);
    }

    const newKeyData = {
      key: values.key,
      ttl: values.ttl,
      value: values.value,
    };
    await redis.setKeyData(newKeyData);

    // ToDo: if change key or create new key then open key in left tree

    runInAction(() => {
      this._isSaving = false;
      this._data = newKeyData;
    });
  }

  @action
  dispose(): void {
    this._data = undefined;
    this._isLoading = false;
    this._isSaving = false;
  }
}
