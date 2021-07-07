import { observable, action, computed, makeObservable } from 'mobx';

import { Connection, ConnectionType, ConnectionData, SshAuthMethod, AuthenticationMethod, FileData } from 'lib/db';

export enum ConnectionFormikField {
  Name = 'name',
  Type = 'type',
  Addresses = 'addresses',

  SentinelName = 'sentinelName',
  SentinelPassword = 'sentinelPassword',

  PerformAuth = 'performAuth',
  Username = 'username',
  Password = 'password',

  Ssh = 'ssh',

  Tls = 'tls',
}

export enum ConnectionAddressFormikField {
  Port = 'port',
  Host = 'host',
}

export enum ConnectionSShFormikField {
  Enabled = 'enabled',
  Host = 'host',
  Port = 'port',
  AuthMethod = 'authMethod',
  PrivateKey = 'privateKey',
  Passphrase = 'passphrase',
  AskForPassphraseEachTime = 'askForPassphraseEachTime',
  Password = 'password',
  AskForPasswordEachTime = 'askForPasswordEachTime',
}

export enum ConnectionTlsFormikField {
  Enabled = 'enabled',
  AuthenticationMethod = 'authenticationMethod',
  CaCertificate = 'caCertificate',
}

export interface ConnectionSShFormikValues {
  enabled: boolean;
  host?: string;
  port?: string;
  authMethod: SshAuthMethod;
  privateKey?: FileData;
  passphrase?: string;
  askForPassphraseEachTime: boolean;
  password?: string;
  askForPasswordEachTime: boolean;
}

export interface ConnectionTlsFormikValues {
  enabled: boolean;
  authenticationMethod: AuthenticationMethod;
  caCertificate?: FileData;
}

export interface ConnectionFormikValues {
  [ConnectionFormikField.Name]?: string;
  [ConnectionFormikField.Type]: ConnectionType;
  [ConnectionFormikField.Addresses]: ConnectionData[];

  [ConnectionFormikField.SentinelName]?: string;
  [ConnectionFormikField.SentinelPassword]?: string;

  [ConnectionFormikField.PerformAuth]: boolean;
  [ConnectionFormikField.Username]?: string;
  [ConnectionFormikField.Password]?: string;

  [ConnectionFormikField.Ssh]: ConnectionSShFormikValues;

  [ConnectionFormikField.Tls]: ConnectionTlsFormikValues;
}

const defaultConnectionData: ConnectionFormikValues = {
  type: ConnectionType.Direct,
  name: 'New Connection',
  addresses: [{ host: 'localhost', port: '6379' }],
  performAuth: false,
  ssh: {
    enabled: false,
    port: '22',
    authMethod: SshAuthMethod.PrivateKey,
    askForPassphraseEachTime: false,
    askForPasswordEachTime: false,
  },
  tls: {
    enabled: false,
    authenticationMethod: AuthenticationMethod.SelfSigned,
  },
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
      ? {
          name: this.connection.name,
          type: this.connection.type,

          sentinelName: this.connection.name,
          sentinelPassword: this.connection.sentinelPassword,

          performAuth: this.connection.performAuth,
          addresses: this.connection.connectionData,
          password: this.connection.password,

          ssh: this.connection.ssh,
          tls: this.connection.tls,
        }
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
