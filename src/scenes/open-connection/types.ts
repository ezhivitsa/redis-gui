import { Redis } from 'lib/redis';

export interface ConnectionData {
  isLoading: boolean;
  open: boolean;
  keys: string[];
  prefixes: {
    [prefix: string]: ConnectionData;
  };
}

export interface Props {
  redis: Redis;
}

export enum IconType {
  Database = 'database',
  Prefix = 'prefix',
  Key = 'key',
}
