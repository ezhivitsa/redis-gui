import { observable, action, computed, makeObservable } from 'mobx';

import { Connection, ConnectionType, ConnectionData } from 'lib/db';

export enum ConnectionFormikField {
  Name = 'name',
  Type = 'type',
  Addresses = 'addresses',
  SentinelName = 'sentinel-name',
  PerformAuth = 'perform-auth',
}

export enum ConnectionAddressFormikField {
  Port = 'port',
  Host = 'host',
}

export interface ConnectionFormikValues {
  [ConnectionFormikField.Name]?: string;
  [ConnectionFormikField.Type]: ConnectionType;
  [ConnectionFormikField.Addresses]: ConnectionData[];
  [ConnectionFormikField.SentinelName]?: string;
  [ConnectionFormikField.PerformAuth]: boolean;
}

const defaultConnectionData: ConnectionFormikValues = {
  type: ConnectionType.Direct,
  name: 'New Connection',
  addresses: [{ host: 'localhost', port: '6379' }],
  'perform-auth': false,
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
    return this.connection
      ? { name: this.connection.name, type: this.connection.type, addresses: this.connection.connectionData }
      : defaultConnectionData;
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
