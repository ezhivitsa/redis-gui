import { action, runInAction, makeObservable, observable, computed } from 'mobx';

import { Connection } from 'lib/db';

import { connectionsClient } from 'data';

export class ConnectionsStore {
  @observable
  private _connections?: Connection[];

  constructor() {
    makeObservable(this);
  }

  @computed
  get connections(): Connection[] | undefined {
    return this._connections;
  }

  async loadData(): Promise<void> {
    const list = await connectionsClient.list();

    runInAction(() => {
      this._connections = list;
    });
  }

  async deleteConnection(id: number): Promise<void> {
    if (!this._connections?.some((conn) => conn.id === id)) {
      return;
    }

    await connectionsClient.deleteItem(id);

    runInAction(() => {
      this._connections = this._connections?.filter((conn) => conn.id !== id);
    });
  }

  @action
  setConnection(connection: Connection): void {
    const hasConnection = this._connections?.some(({ id }) => id === connection.id);
    if (hasConnection) {
      this._connections = this._connections?.map((conn) => (conn.id === connection.id ? connection : conn));
    } else {
      this._connections?.push(connection);
    }
  }

  @action
  dispose(): void {
    this._connections = undefined;
  }
}
