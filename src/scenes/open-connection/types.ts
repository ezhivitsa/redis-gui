import { Redis } from 'lib/redis';

export interface ConnectionData {
  [prefix: string]: ConnectionData | true;
}

export interface Props {
  redis: Redis;
}

export enum IconType {
  Database = 'database',
  Prefix = 'prefix',
  Key = 'key',
}
