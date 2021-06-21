import { action, runInAction, makeObservable, observable } from 'mobx';

import { Connection } from 'lib/db';

import { connections } from 'data';

export class ConnectionsStore {
  @observable
  connections: Connection[] | null = null;

  @observable
  isLoading = false;

  @observable
  selectedConnection: Connection | null = null;

  constructor() {
    makeObservable(this);
  }

  @action
  async loadData(): Promise<void> {
    this.isLoading = true;

    try {
      const list = await connections.list();

      runInAction(() => {
        this.connections = list;
        this.isLoading = false;
      });
    } catch (err) {
      console.error(err);

      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  @action
  setSelected(connection: Connection): void {
    this.selectedConnection = connection;
  }

  @action
  dispose(): void {
    this.connections = null;
    this.selectedConnection = null;
  }
}
