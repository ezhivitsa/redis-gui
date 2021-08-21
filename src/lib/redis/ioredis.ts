import Redis, { RedisOptions, Redis as IORedisOrig, ClusterNode, ClusterOptions, Cluster } from 'ioredis';

import { BaseRedis } from './base-redis';

import { AskedRedisAuthData } from './types';

export class IoRedis extends BaseRedis<IORedisOrig> {
  private _options: RedisOptions;

  constructor(options: RedisOptions) {
    super();
    this._options = options;
  }

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

export class IoRedisCluster extends BaseRedis<Cluster> {
  private _nodes: ClusterNode[];
  private _options?: ClusterOptions;

  constructor(nodes: ClusterNode[], options?: ClusterOptions) {
    super();

    this._nodes = nodes;
    this._options = options;
  }

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
