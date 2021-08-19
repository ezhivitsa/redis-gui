import { Redis as IORedisOrig, Cluster } from 'ioredis';

import { AskedRedisAuthData, PrefixesAndKeys, KeyData } from './types';

export const KEY_SEPARATOR = ':';
export const NO_VALUE = -1;

export abstract class BaseRedis<R extends IORedisOrig | Cluster> {
  protected _redis?: R;

  abstract connect(data: AskedRedisAuthData): Promise<void>;

  abstract disconnect(): void;

  abstract getPrefixesAndKeys(prefix?: string[]): Promise<PrefixesAndKeys>;

  protected _getPrefixesAndKeysFromKeys(keys: string[], prefix: string[] = []): PrefixesAndKeys {
    const result: PrefixesAndKeys = { keys: [], prefixes: [] };
    const matchPrefix = prefix.join(KEY_SEPARATOR);

    for (let i = 0; i < keys.length; i++) {
      const key: string = keys[i];
      const keyEnd = matchPrefix && key.startsWith(matchPrefix) ? key.substring(matchPrefix.length + 1) : key;
      const isKey = !keyEnd.includes(KEY_SEPARATOR);

      if (isKey) {
        result.keys.push(keyEnd);
      } else {
        const resultPrefix = keyEnd.substring(0, keyEnd.indexOf(KEY_SEPARATOR));
        result.prefixes.push(resultPrefix);
      }
    }

    return result;
  }

  protected _getMatchPrefix(prefix: string[]): string {
    return prefix.length ? `${prefix.join(KEY_SEPARATOR)}:*` : '*';
  }

  protected _getKey(prefix: string[]): string {
    return prefix.join(KEY_SEPARATOR);
  }

  async getKeyData(prefix: string[]): Promise<KeyData | undefined> {
    if (!this._redis) {
      return;
    }

    const key = this._getKey(prefix);

    const data = (await this._redis.multi().ttl(key).get(key).exec()) as [
      [Error | null, number],
      [Error | null, string],
    ];

    return {
      key,
      ttl: data[0][1] !== NO_VALUE ? data[0][1] : undefined,
      value: data[1][1],
    };
  }

  async setKeyData(data: KeyData): Promise<void> {
    if (!this._redis) {
      return;
    }

    if (data.ttl !== undefined) {
      await this._redis.setex(data.key, data.ttl, data.value);
    } else {
      await this._redis.set(data.key, data.value);
    }
  }

  async deleteKey(key: string): Promise<void> {
    if (!this._redis) {
      return;
    }

    await this._redis.del(key);
  }
}
