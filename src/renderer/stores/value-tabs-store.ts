import { action, computed, makeObservable, observable } from 'mobx';

import { listToKey } from 'lib/key';

import { KeyData } from 'main/lib/redis';

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
  get selectedPrefix(): TabData | undefined {
    return this._selectedPrefix;
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
  removeSelectedPrefix(): void {
    if (
      this._activeTab?.redisId === this._selectedPrefix?.redisId &&
      listToKey(this._activeTab?.prefix) === listToKey(this._selectedPrefix?.prefix)
    ) {
      this._activeTab = undefined;
    }

    this._selectedPrefix = undefined;
  }

  @action
  dispose(): void {
    this._activeTab = undefined;
    this._data = undefined;
  }
}
