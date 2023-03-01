import { v4 as uuidv4 } from 'uuid';

import { dbPromise, Connection } from 'lib/db';

import { DB_CONNECTIONS_STORE } from 'constants/app-constants';

export async function list(): Promise<Connection[]> {
  const connections = (await dbPromise).getAll(DB_CONNECTIONS_STORE);
  return connections;
}

export async function create(data: Omit<Connection, 'id'>): Promise<Connection> {
  const db = await dbPromise;

  const connectionData = {
    id: uuidv4(),
    ...data,
  };

  await db.add(DB_CONNECTIONS_STORE, connectionData as Connection);

  return connectionData;
}

export async function update(id: string, data: Omit<Connection, 'id'>): Promise<Connection> {
  const db = await dbPromise;

  const connectionData = { ...data, id };
  await db.put(DB_CONNECTIONS_STORE, connectionData as Connection);

  return connectionData;
}

export async function deleteItem(id: string): Promise<void> {
  const db = await dbPromise;
  await db.delete(DB_CONNECTIONS_STORE, id);
}
