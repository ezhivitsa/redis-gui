import { observable, makeObservable, action, computed } from 'mobx';

import { KeyData } from 'lib/redis';
import { listToKey } from 'lib/key';

interface TabData {
  redisId: string;
  prefix: string[];
}

export class ValueTabsStore {
  @observable
  private _activeTab?: TabData;

  @observable
  private _selectedPrefix?: TabData;

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
  setSelectedPrefix(redisId: string, prefix: string[]): void {
    this._selectedPrefix = {
      redisId,
      prefix,
    };
  }

  @action
  setActiveData(data?: KeyData): void {
    this._data = data;
  }

  @action
  removeActiveTab(unselectIfSelected?: boolean): void {
    if (
      unselectIfSelected &&
      this._activeTab?.redisId === this._selectedPrefix?.redisId &&
      listToKey(this._activeTab?.prefix) === listToKey(this._selectedPrefix?.prefix)
    ) {
      this._selectedPrefix = undefined;
    }

    this._activeTab = undefined;
  }

  @action
  dispose(): void {
    this._activeTab = undefined;
    this._data = undefined;
  }
}
