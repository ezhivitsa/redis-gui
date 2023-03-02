import { openDB } from 'idb';

import { DB_NAME, DB_VERSION, DB_CONNECTIONS_STORE } from 'renderer/constants/app-constants';

import { Db } from './types';

export const dbPromise = openDB<Db>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore(DB_CONNECTIONS_STORE, { keyPath: 'id' });
  },
});
