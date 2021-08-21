import { REDIS_PREFIX_SEPARATOR } from 'constants/app-constants';

export function listToKey(items: string[]): string {
  return items.join(REDIS_PREFIX_SEPARATOR);
}

export function keyToList(key: string): string[] {
  return key ? key.split(REDIS_PREFIX_SEPARATOR) : [];
}

export function hasPrefix(key: string): boolean {
  return key.includes(REDIS_PREFIX_SEPARATOR);
}
