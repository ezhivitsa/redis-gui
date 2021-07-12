import { action, runInAction, makeObservable, observable } from 'mobx';

import { Connection } from 'lib/db';

import { connectionsClient } from 'data';

import { ConnectionStore } from './connection-store';

export class ConnectionsStore {
  @observable
  connections: Connection[] | null = null;

  @observable
  isLoading = false;

  @observable
  selectedConnection: Connection | null = null;

  private _connectionStore: ConnectionStore;

  constructor(connectionStore: ConnectionStore) {
    makeObservable(this);

    this._connectionStore = connectionStore;
  }

  @action
  async loadData(): Promise<void> {
    this.isLoading = true;

    try {
      const list = await connectionsClient.list();

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

  openEditConnection(): void {
    this._connectionStore.setConnection(this.selectedConnection);
  }

  openCreateConnection(): void {
    this._connectionStore.setConnection(null);
  }

  deleteConnection(): void {}

  cloneConnection(): void {}

  @action
  setSelected(connection: Connection | null): void {
    this.selectedConnection = connection;
  }

  @action
  dispose(): void {
    this.connections = null;
    this.selectedConnection = null;
  }
}
