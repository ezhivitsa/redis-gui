import { KeyboardEvent } from 'react';

enum Key {
  Enter = 'Enter',
}

export function isEnterEvent(event: KeyboardEvent): boolean {
  return event.key === Key.Enter;
}

export function handleEnterEvent(callback: (event: KeyboardEvent) => void) {
  return (event: KeyboardEvent): void => {
    if (isEnterEvent(event)) {
      callback(event);
    }
  };
}
