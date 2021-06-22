import { observable, action, makeObservable } from 'mobx';

import { Connection } from 'lib/db';

export class ConnectionStore {
  @observable
  connection: Connection | null = null;

  @observable
  modalVisible = false;

  constructor() {
    makeObservable(this);
  }

  @action
  setConnection(connection: Connection | null): void {
    this.connection = connection;
    this.modalVisible = true;
  }

  @action
  closeModal(): void {
    this.modalVisible = false;
  }

  @action
  dispose(): void {
    this.connection = null;
    this.modalVisible = false;
  }
}
