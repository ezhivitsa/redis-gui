import { AskedRedisAuthData, PrefixesAndKeys } from './types';

export const KEY_SEPARATOR = ':';

export abstract class BaseRedis {
  abstract connect(data: AskedRedisAuthData): Promise<void>;

  abstract disconnect(): void;

  abstract getPrefixesAndKeys(prefix?: string[]): Promise<PrefixesAndKeys>;

  protected _getPrefixesAndKeysFromKeys(keys: string[], prefix: string[] = []): PrefixesAndKeys {
    const result: PrefixesAndKeys = { keys: [], prefixes: [] };
    const matchPrefix = this._getMatchPrefix(prefix);

    for (let i = 0; i < keys.length; i++) {
      const key: string = keys[i];
      const keyEnd = prefix && key.startsWith(matchPrefix) ? key.substring(prefix.length) : key;
      const isKey = key.includes(KEY_SEPARATOR);

      if (isKey) {
        result.keys.push(keyEnd);
      } else {
        const resultPrefix = key.substring(0, key.indexOf(KEY_SEPARATOR));
        result.prefixes.push(resultPrefix);
      }
    }

    return result;
  }

  protected _getMatchPrefix(prefix: string[]): string {
    return prefix.length ? `${prefix.join(KEY_SEPARATOR)}:*` : '*';
  }
}
