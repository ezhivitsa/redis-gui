import { MenuEvent, MenuHandler } from './types';

class MenuObserver {
  private _events: Partial<Record<MenuEvent, MenuHandler[]>> = {};

  addEventListener(event: MenuEvent, handler: MenuHandler): void {
    this._events[event] = this._events[event] || [];
    this._events[event]?.push(handler);
  }

  removeEventListener(event: MenuEvent, handler: MenuHandler): void {
    this._events[event] = this._events[event]?.filter((eventHandler) => eventHandler !== handler);
  }

  dispatchEvent(event: MenuEvent): void {
    this._events[event]?.forEach((handler) => {
      handler();
    });
  }
}

export const menuObserver = new MenuObserver();
