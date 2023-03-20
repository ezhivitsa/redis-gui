import { Cluster, Redis as IORedisOrig } from 'ioredis';
import { uniq } from 'lodash';

import { listToKey, parseKey } from '../../../lib/key';

import { AskedRedisAuthData, KeyData, PrefixesAndKeys, SshRedisAddress } from './types';

export const NO_VALUE = -1;

export abstract class BaseRedis<R extends IORedisOrig | Cluster> {
  protected _redis?: R;

  abstract connect(sshData: Record<string, SshRedisAddress>, data: AskedRedisAuthData): Promise<void>;

  abstract disconnect(): void;

  protected _getPrefixesAndKeysFromKeys(keys: string[], prefix: string[] = []): PrefixesAndKeys {
    const result: PrefixesAndKeys = { keys: [], prefixes: {} };
    const matchPrefix = listToKey(prefix);

    for (let i = 0; i < keys.length; i++) {
      const { key, prefix } = parseKey(keys[i], matchPrefix);
      if (prefix) {
        result.prefixes[prefix] = result.prefixes[prefix] || [];
        result.prefixes[prefix].push(key);
      } else {
        result.keys.push(key);
      }
    }

    return result;
  }

  protected _getMatchPrefix(prefix: string[]): string {
    return prefix.length ? `${listToKey(prefix)}:*` : '*';
  }

  protected _getKey(prefix: string[]): string {
    return listToKey(prefix);
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

  getPrefixesAndKeys(prefix: string[] = []): Promise<PrefixesAndKeys> {
    const result: PrefixesAndKeys = { keys: [], prefixes: {} };

    return new Promise((resolve) => {
      if (!this._redis) {
        resolve(result);
        return;
      }

      // TODO: fix scan stream
      const stream = (this._redis as IORedisOrig).scanStream({
        match: this._getMatchPrefix(prefix),
      });

      stream.on('data', (resultKeys) => {
        const res = this._getPrefixesAndKeysFromKeys(resultKeys, prefix);

        Object.keys(res.prefixes).forEach((prefixKey) => {
          if (result.prefixes[prefixKey]) {
            result.prefixes[prefixKey] = uniq([...result.prefixes[prefixKey], ...res.prefixes[prefixKey]]).sort();
          } else {
            result.prefixes[prefixKey] = res.prefixes[prefixKey];
          }
        });

        result.keys.push(...res.keys);
      });

      stream.on('end', () => {
        resolve({
          prefixes: result.prefixes,
          keys: uniq(result.keys.sort()),
        });
      });
    });
  }
}
