import { dbPromise, Connection } from 'lib/db';

import { DB_CONNECTIONS_STORE } from 'constants/app-constants';

export async function list(): Promise<Connection[]> {
  const connections = (await dbPromise).getAll(DB_CONNECTIONS_STORE);
  return connections;
}

export async function create(data: Omit<Connection, 'id'>): Promise<Connection> {
  const db = await dbPromise;
  const key = await db.add(DB_CONNECTIONS_STORE, data);

  return {
    id: key as number,
    ...data,
  };
}
