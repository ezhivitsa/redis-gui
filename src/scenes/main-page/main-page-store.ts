import { makeObservable, observable, action, computed } from 'mobx';

import { Redis } from 'lib/redis';

export class MainPageStore {
  @observable
  private _connectionsListOpened = false;

  @observable
  private _openConnections: Redis[] = [];

  constructor() {
    makeObservable(this);
  }

  @computed
  get connectionsListOpened(): boolean {
    return this._connectionsListOpened;
  }

  @computed
  get openConnections(): Redis[] {
    return this._openConnections;
  }

  @action
  setConnectionsListOpened(opened: boolean): void {
    this._connectionsListOpened = opened;
  }

  @action
  addOpenConnection(redis: Redis): void {
    this._openConnections.push(redis);
  }
}
