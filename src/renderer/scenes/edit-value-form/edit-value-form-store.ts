import { observable, makeObservable, computed, action, runInAction } from 'mobx';

import { ValueTabsStore, ConnectionsDataStore, ConnectionDataStore } from 'renderer/stores';

import { KeyData } from 'renderer/lib/redis';
import { keyToList } from 'renderer/lib/key';

import { EditDataValues } from './types';

interface Deps {
  valueTabsStore: ValueTabsStore;
  connectionsDataStore: ConnectionsDataStore;
}
export class EditValueFormStore {
  private _valueTabsStore: ValueTabsStore;
  private _connectionsDataStore: ConnectionsDataStore;

  @observable
  private _isLoading = false;

  @observable
  private _isSaving = false;

  constructor({ valueTabsStore, connectionsDataStore }: Deps) {
    this._valueTabsStore = valueTabsStore;
    this._connectionsDataStore = connectionsDataStore;

    makeObservable(this);
  }

  @computed
  get currentKey(): string[] | undefined {
    return this._valueTabsStore.activeTab?.prefix;
  }

  @computed
  get currentRedisId(): string | undefined {
    return this._valueTabsStore.activeTab?.redisId;
  }

  get selectedRedisId(): string | undefined {
    return this._valueTabsStore.selectedPrefix?.redisId;
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
    return this._valueTabsStore.activeKeyData;
  }

  private get _dataStore(): ConnectionDataStore | undefined {
    return this._connectionsDataStore.getConnectionDataStore(this.currentRedisId);
  }

  @action
  async getKeyData(): Promise<void> {
    const prefix = this.currentKey;
    const dataStore = this._dataStore;
    if (!dataStore || !prefix) {
      return;
    }

    this._isLoading = true;

    const data = await dataStore.getKeyData(prefix);
    this._valueTabsStore.setActiveData(data);

    runInAction(() => {
      this._isLoading = false;
    });
  }

  @action
  async saveValue(values: EditDataValues): Promise<void> {
    const keyData = this.keyData;
    const dataStore = this._connectionsDataStore.getConnectionDataStore(values.redisId);

    if (!dataStore) {
      return;
    }

    this._isSaving = true;

    if (keyData && keyData?.key !== values.key) {
      const prefix = keyToList(keyData.key);
      await dataStore.deleteKey(prefix.slice(0, prefix.length - 1), prefix[prefix.length - 1]);
    }

    const newKeyData = {
      key: values.key,
      ttl: values.ttl,
      value: values.value,
    };
    await dataStore.setKeyData(newKeyData);

    runInAction(() => {
      this._isSaving = false;
      this._valueTabsStore.setActiveData(newKeyData);
    });
  }

  @action
  dispose(): void {
    this._isLoading = false;
    this._isSaving = false;
  }
}
