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

  async deleteConnection(id: string): Promise<void> {
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

  async cloneConnection(id: string): Promise<void> {
    const connection = this._connections?.find((conn) => conn.id === id);

    if (!connection) {
      return;
    }

    // eslint-disable-next-line
    const { id: connectionId, ...clonedConnection } = connection;
    const connectionData = await connectionsClient.create(JSON.parse(JSON.stringify(clonedConnection)));
    this._connections?.push(connectionData);
  }

  @action
  dispose(): void {
    this._connections = undefined;
  }
}
