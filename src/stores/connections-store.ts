import { action, runInAction, makeObservable, observable } from 'mobx';

import { Connection } from 'lib/db';

import { connectionsClient } from 'data';

import { ConnectionStore } from './connection-store';

export class ConnectionsStore {
  @observable
  connections: Connection[] | null = null;

  private _connectionStore: ConnectionStore;

  constructor(connectionStore: ConnectionStore) {
    makeObservable(this);

    this._connectionStore = connectionStore;
  }

  async loadData(): Promise<void> {
    const list = await connectionsClient.list();

    runInAction(() => {
      this.connections = list;
    });
  }

  openEditConnection(): void {
    // this._connectionStore.setConnection(this.selectedConnection);
  }

  openCreateConnection(): void {
    this._connectionStore.setConnection(null);
  }

  async deleteConnection(id: number): Promise<void> {
    if (!this.connections?.some((conn) => conn.id === id)) {
      return;
    }

    await connectionsClient.deleteItem(id);

    runInAction(() => {
      this.connections = this.connections?.filter((conn) => conn.id !== id) || null;
    });
  }

  cloneConnection(): void {}

  @action
  dispose(): void {
    this.connections = null;
  }
}
