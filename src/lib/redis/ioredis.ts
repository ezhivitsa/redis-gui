import Redis, { RedisOptions, Redis as IORedisOrig } from 'ioredis';

export class IoRedis {
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
