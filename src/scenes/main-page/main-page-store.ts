import { makeObservable, observable, action, computed } from 'mobx';

import { SceneStore } from 'types';

export class MainPageStore extends SceneStore {
  @observable
  private _connectionsListOpened = false;

  constructor() {
    super();

    makeObservable(this);
  }

  @computed
  get connectionsListOpened(): boolean {
    return this._connectionsListOpened;
  }

  @action
  setConnectionsListOpened(opened: boolean): void {
    this._connectionsListOpened = opened;
  }
}
