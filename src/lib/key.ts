export const REDIS_PREFIX_SEPARATOR = ':';

export function listToKey(items: string[] = []): string {
  return items.join(REDIS_PREFIX_SEPARATOR);
}

export function keyToList(key: string): string[] {
  return key ? key.split(REDIS_PREFIX_SEPARATOR) : [];
}

export function hasPrefix(key: string): boolean {
  return key.includes(REDIS_PREFIX_SEPARATOR);
}

export function parseKey(key: string, prefix: string): { key: string; prefix?: string } {
  const keyEnd = prefix && key.startsWith(prefix) ? key.substring(prefix.length + 1) : key;
  const isKey = !keyEnd.includes(REDIS_PREFIX_SEPARATOR);

  if (isKey) {
    return { key: keyEnd };
  } else {
    const parts = keyToList(keyEnd);
    const resultPrefix = parts.slice(0, parts.length - 1);
    const resultKey = parts[parts.length - 1];
    const resultPrefixStr = listToKey(resultPrefix);

    return { prefix: resultPrefixStr, key: resultKey };
  }
}
