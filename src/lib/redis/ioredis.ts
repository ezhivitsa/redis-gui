import Redis, { RedisOptions, Redis as IORedisOrig, ClusterNode, ClusterOptions, Cluster } from 'ioredis';
import { sortedUniq } from 'lodash';

import { BaseRedis } from './base-redis';

import { AskedRedisAuthData, PrefixesAndKeys } from './types';

export class IoRedis extends BaseRedis {
  private _redis?: IORedisOrig;
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

  async getPrefixesAndKeys(prefix: string[] = []): Promise<PrefixesAndKeys> {
    const result: PrefixesAndKeys = { keys: [], prefixes: [] };

    return new Promise((resolve) => {
      if (!this._redis) {
        resolve(result);
        return;
      }

      const stream = this._redis.scanStream({
        match: this._getMatchPrefix(prefix),
      });

      stream.on('data', (resultKeys) => {
        const res = this._getPrefixesAndKeysFromKeys(resultKeys, prefix);

        result.prefixes.push(...res.prefixes);
        result.keys.push(...res.keys);
      });

      stream.on('end', () => {
        resolve({
          prefixes: sortedUniq(result.prefixes),
          keys: sortedUniq(result.keys),
        });
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

export class IoRedisCluster extends BaseRedis {
  private _redis?: Cluster;
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

  getPrefixesAndKeys(prefix: string[] = []): Promise<PrefixesAndKeys> {
    const result: PrefixesAndKeys = { keys: [], prefixes: [] };

    return new Promise((resolve) => {
      if (!this._redis) {
        resolve(result);
        return;
      }

      const stream = this._redis.scanStream({
        match: this._getMatchPrefix(prefix),
      });

      stream.on('data', (resultKeys) => {
        const res = this._getPrefixesAndKeysFromKeys(resultKeys, prefix);

        result.prefixes.push(...res.prefixes);
        result.keys.push(...res.keys);
      });

      stream.on('end', () => {
        resolve({
          prefixes: sortedUniq(result.prefixes),
          keys: sortedUniq(result.keys),
        });
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
