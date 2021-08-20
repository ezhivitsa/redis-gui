import { observable, makeObservable, action, computed } from 'mobx';

interface TabData {
  redisId: string;
  prefix: string[];
}

export class ValueTabsStore {
  @observable
  private _activeTab?: TabData;

  constructor() {
    makeObservable(this);
  }

  @computed
  get activeTab(): TabData | undefined {
    return this._activeTab;
  }

  @action
  setActiveTab(redisId: string, prefix: string[]): void {
    this._activeTab = {
      redisId,
      prefix,
    };
  }

  @action
  dispose(): void {
    this._activeTab = undefined;
  }
}
