import { Connection } from 'data';

import { connectionsClient } from 'renderer/data';

export class ConnectionStore {
  async createOrUpdate(data: Omit<Connection, 'id'>, id?: string): Promise<Connection> {
    let connectionData: Connection;

    if (id) {
      connectionData = await connectionsClient.update(id, data);
    } else {
      connectionData = await connectionsClient.create(data);
    }

    return connectionData;
  }
}
