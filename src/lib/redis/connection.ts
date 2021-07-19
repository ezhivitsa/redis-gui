import IORedis, { Redis, RedisOptions } from 'ioredis';

import { Connection, ConnectionType } from 'lib/db';

export function getRedisConnection({ main, auth, tls }: Connection): Redis {

  
  }

  return new IORedis(options);
}
