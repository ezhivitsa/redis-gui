import { observable, makeObservable, action, computed } from 'mobx';

import { KeyData } from 'lib/redis';

interface TabData {
  redisId: string;
  prefix: string[];
}

export class ValueTabsStore {
  @observable
  private _activeTab?: TabData;

  @observable
  private _data?: KeyData;

  constructor() {
    makeObservable(this);
  }

  @computed
  get activeTab(): TabData | undefined {
    return this._activeTab;
  }

  @computed
  get activeKeyData(): KeyData | undefined {
    return this._data;
  }

  @action
  setActiveTab(redisId: string, prefix: string[]): void {
    this._activeTab = {
      redisId,
      prefix,
    };
  }

  @action
  setActiveData(data?: KeyData): void {
    this._data = data;
  }

  @action
  removeActiveTab(): void {
    this._activeTab = undefined;
  }

  @action
  dispose(): void {
    this._activeTab = undefined;
    this._data = undefined;
  }
}
