import Redis, { Cluster, ClusterNode, ClusterOptions, Redis as IORedisOrig, RedisOptions } from 'ioredis';

import { isObject } from 'main/lib/assert';

import { BaseRedis } from './base-redis';
import { AskedRedisAuthData, SshRedisAddress } from './types';

export class IoRedis extends BaseRedis<IORedisOrig> {
  private _options: RedisOptions;

  constructor(options: RedisOptions) {
    super();
    this._options = options;
  }

  async connect(sshData: Record<string, SshRedisAddress>, data: AskedRedisAuthData): Promise<void> {
    console.log('connect');
    return new Promise((resolve, reject) => {
      const options: RedisOptions = {
        ...this._options,

        sentinels: this._options.sentinels?.map(({ host, port }) => {
          const sshAddress = sshData[`${host}:${port}`];
          if (sshAddress) {
            return {
              host: sshAddress.host,
              port: sshAddress.port,
            };
          }

          return {
            host,
            port,
          };
        }),

        tls: this._options.tls
          ? {
              ...this._options.tls,
              passphrase: this._options.tls.passphrase || data.tlsPassphrase,
            }
          : undefined,
      };

      const sshAddress = sshData[`${options.host}:${options.port}`];
      if (sshAddress) {
        options.host = sshAddress.host;
        options.port = sshAddress.port;
      }

      console.log(options);
      console.log(Redis);
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

  connect(sshData: Record<string, SshRedisAddress>, data: AskedRedisAuthData): Promise<void> {
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

      const nodes = this._nodes.map((clusterNode): ClusterNode => {
        if (!isObject(clusterNode)) {
          return clusterNode;
        }

        const { host, port } = clusterNode;
        const sshAddress = sshData[`${host}:${port}`];
        if (sshAddress) {
          return {
            host: sshAddress.host,
            port: sshAddress.port,
          };
        }

        return {
          host,
          port,
        };
      });

      this._redis = new Cluster(nodes, {
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
