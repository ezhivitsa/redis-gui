import { useState, useEffect } from 'react';

import { getMatchMedia, releaseMatchMedia } from './utils';
import { Media } from './types';

const IS_BROWSER = window !== undefined;
const SUPPORTS_TOUCH =
  (IS_BROWSER && 'ontouchstart' in window) || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

export function useMq(media: Media | string, touch?: boolean): boolean {
  const [isMatched, setIsMatched] = useState(false);

  function setMatchesValue(matches: boolean): void {
    let queryPass = true;
    let touchPass = true;

    if (media) {
      queryPass = matches;
    }
    if (touch) {
      touchPass = SUPPORTS_TOUCH;
    } else if (touch === false) {
      touchPass = !SUPPORTS_TOUCH;
    }

    const result = queryPass && touchPass;
    if (result !== isMatched) {
      setIsMatched(result);
    }
  }

  function handleMatch(event: MediaQueryListEvent): void {
    setMatchesValue(event.matches);
  }

  useEffect(() => {
    const mql = getMatchMedia(media);
    mql.addEventListener('change', handleMatch);
    setMatchesValue(mql.matches);

    return () => {
      releaseMatchMedia(media);
      mql.removeEventListener('change', handleMatch);
    };
  });

  return isMatched;
}
