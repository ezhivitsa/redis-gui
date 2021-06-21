import { KeyboardEvent } from 'react';

enum Key {
  Enter = 'Enter',
}

export function isEnterEvent(event: KeyboardEvent): boolean {
  return event.key === Key.Enter;
}
