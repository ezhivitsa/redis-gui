import { makeObservable, observable, action, computed } from 'mobx';

export class MainPageStore {
  @observable
  private _connectionsListOpened = false;

  constructor() {
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
