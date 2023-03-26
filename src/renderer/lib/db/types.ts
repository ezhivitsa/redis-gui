import { DBSchema } from 'idb';

import type { Connection } from 'data';

export interface Db extends DBSchema {
  connections: {
    value: Connection;
    key: string;
  };
}
