import { Media } from './types';
import { mediaQueries } from './mq';

const pool: Record<string, MediaQueryList> = {};
const refCounters: Record<string, number> = {};

export function getMatchMedia(queryProp: Media | string): MediaQueryList {
  const query = mediaQueries[queryProp as Media] || queryProp;

  if (!pool[query]) {
    pool[query] = window.matchMedia(query);
    refCounters[query] = 1;
  } else {
    refCounters[query] += 1;
  }

  return pool[query];
}

export function releaseMatchMedia(queryProp: Media | string): void {
  const query = mediaQueries[queryProp as Media] || queryProp;

  refCounters[query] -= 1;

  if (pool[query] && refCounters[query] === 0) {
    delete pool[query];
    delete refCounters[query];
  }
}
