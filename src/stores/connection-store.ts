import { observable, action, computed, makeObservable } from 'mobx';

import { Connection, ConnectionType } from 'lib/db';

export enum ConnectionFormikField {
  Name = 'name',
  Type = 'type',
}

export interface ConnectionFormikValues {
  [ConnectionFormikField.Name]?: string;
  [ConnectionFormikField.Type]: ConnectionType;
}

const defaultConnectionData: ConnectionFormikValues = {
  type: ConnectionType.Direct,
  name: 'New Connection',
};

export class ConnectionStore {
  @observable
  connection: Connection | null = null;

  @observable
  modalVisible = false;

  constructor() {
    makeObservable(this);
  }

  @computed
  get initialValues(): ConnectionFormikValues {
    return this.connection ? { name: this.connection.name, type: this.connection.type } : defaultConnectionData;
  }

  @action
  createOrUpdateConnection(data: ConnectionFormikValues): void {}

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
