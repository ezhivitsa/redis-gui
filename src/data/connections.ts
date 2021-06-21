import { dbPromise, Connection } from 'lib/db';

import { DB_CONNECTIONS_STORE } from 'constants/app-constants';

export async function list(): Promise<Connection[]> {
  const connections = (await dbPromise).getAll(DB_CONNECTIONS_STORE);
  return connections;
}
