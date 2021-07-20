import Redis, { RedisOptions, Redis as IORedisOrig, ClusterNode, ClusterOptions, Cluster } from 'ioredis';

interface IRedis {
  connect(): Promise<void>;
  disconnect(): void;
}

export class IoRedis implements IRedis {
  private _redis?: IORedisOrig;

  constructor(private _options: RedisOptions) {}

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._redis = new Redis(this._options);

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

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._redis = new Redis.Cluster(this._nodes, this._options);

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
