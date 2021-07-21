import Redis, { RedisOptions, Redis as IORedisOrig, ClusterNode, ClusterOptions, Cluster } from 'ioredis';

import { AskedRedisAuthData, IRedis } from './types';

export class IoRedis implements IRedis {
  private _redis?: IORedisOrig;

  constructor(private _options: RedisOptions) {}

  async connect(data: AskedRedisAuthData): Promise<void> {
    return new Promise((resolve, reject) => {
      const options: RedisOptions = {
        ...this._options,
        tls: this._options.tls
          ? {
              ...this._options.tls,
              passphrase: this._options.tls.passphrase || data.tlsPassphrase,
            }
          : undefined,
      };

      this._redis = new Redis(options);

      this._redis.on('ready', () => {
        resolve();
      });

      this._redis.on('error', (error) => {
        reject(error);
      });
    });
  }

  disconnect(): void {
    if (!this._redis) {
      return;
    }

    this._redis.disconnect();
  }
}

export class IoRedisCluster implements IRedis {
  private _redis?: Cluster;

  constructor(private _nodes: ClusterNode[], private _options?: ClusterOptions) {}

  connect(data: AskedRedisAuthData): Promise<void> {
    return new Promise((resolve, reject) => {
      const redisOptions: RedisOptions | undefined = this._options?.redisOptions
        ? {
            ...this._options?.redisOptions,
            tls: this._options?.redisOptions.tls
              ? {
                  ...this._options?.redisOptions.tls,
                  passphrase: this._options?.redisOptions.tls.passphrase || data.tlsPassphrase,
                }
              : undefined,
          }
        : undefined;

      this._redis = new Redis.Cluster(this._nodes, {
        ...this._options,
        redisOptions,
      });

      this._redis.on('ready', () => {
        resolve();
      });

      this._redis.on('error', (error) => {
        reject(error);
      });
    });
  }

  disconnect(): void {
    if (!this._redis) {
      return;
    }

    this._redis.disconnect();
  }
}
