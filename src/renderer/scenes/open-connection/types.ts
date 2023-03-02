import { Redis } from 'renderer/lib/redis';

export interface Props {
  redis: Redis;
}

export enum IconType {
  Database = 'database',
  Prefix = 'prefix',
  Key = 'key',
}
