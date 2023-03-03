import { openDB } from 'idb';

import { DB_CONNECTIONS_STORE, DB_NAME, DB_VERSION } from 'renderer/constants/app-constants';

import { Db } from './types';

export const dbPromise = openDB<Db>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore(DB_CONNECTIONS_STORE, { keyPath: 'id' });
  },
});
