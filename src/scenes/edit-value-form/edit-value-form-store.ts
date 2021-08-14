import { observable, makeObservable, computed } from 'mobx';

import { ConnectionDataStore } from 'stores';

interface Deps {
  connectionDataStore: ConnectionDataStore;
}
export class EditValueFormStore {
  @observable
  private _connectionDataStore: ConnectionDataStore;

  constructor({ connectionDataStore }: Deps) {
    this._connectionDataStore = connectionDataStore;

    makeObservable(this);
  }

  @computed
  get currentKey(): string[] | undefined {
    return this._connectionDataStore.currentKey?.prefix;
  }

  @computed
  get currentRedis(): string | undefined {
    return this._connectionDataStore.currentKey?.redisId;
  }
}
