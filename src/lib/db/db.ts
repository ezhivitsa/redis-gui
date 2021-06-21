import { openDB } from 'idb';

import { DB_NAME, DB_VERSION, DB_CONNECTIONS_STORE } from 'constants/app-constants';

import { DbSchema } from './types';

export const dbPromise = openDB<DbSchema>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore(DB_CONNECTIONS_STORE, { keyPath: 'id', autoIncrement: true });
  },
});
