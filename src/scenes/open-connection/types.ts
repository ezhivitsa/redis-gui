import { Redis } from 'lib/redis';

export interface ConnectionLoadingData {
  isLoading: boolean;
  prefixes: {
    [prefix: string]: ConnectionLoadingData;
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
