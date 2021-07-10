import { observable, action, computed, makeObservable } from 'mobx';

import {
  Connection,
  ConnectionType,
  ConnectionData,
  SshAuthMethod,
  AuthenticationMethod,
  FileData,
  InvalidHostnames,
} from 'lib/db';

import { connectionsClient } from 'data';

export enum ConnectionFormikField {
  Main = 'main',
  Auth = 'auth',
  Ssh = 'ssh',
  Tls = 'tls',
  Advanced = 'advanced',
}

export enum ConnectionMainFormikField {
  Name = 'name',
  Type = 'type',
  Addresses = 'addresses',
  ReadOnly = 'readOnly',
  SentinelName = 'sentinelName',
}

export enum ConnectionAuthFormikField {
  PerformAuth = 'performAuth',
  Username = 'username',
  Password = 'password',
  SentinelPassword = 'sentinelPassword',
}

export enum ConnectionAddressFormikField {
  Port = 'port',
  Host = 'host',
}

export enum ConnectionSShFormikField {
  Enabled = 'enabled',
  Host = 'host',
  Port = 'port',
  Username = 'username',
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
  UsePem = 'usePem',
  Pem = 'pem',
  Passphrase = 'passphrase',
  AskForPassphraseEachTime = 'askForPassphraseEachTime',
  AdvancedOptions = 'advancedOptions',
  Crl = 'crl',
  InvalidHostnames = 'invalidHostnames',
}

export enum ConnectionAdvancedFormikField {
  Family = 'family',
  Db = 'db',
  KeyPrefix = 'keyPrefix',
  StringNumbers = 'stringNumbers',
}

export interface ConnectionSShFormikValues {
  [ConnectionSShFormikField.Enabled]: boolean;
  [ConnectionSShFormikField.Host]: string;
  [ConnectionSShFormikField.Port]: string;
  [ConnectionSShFormikField.Username]: string;
  [ConnectionSShFormikField.AuthMethod]: SshAuthMethod;
  [ConnectionSShFormikField.PrivateKey]?: FileData;
  [ConnectionSShFormikField.Passphrase]: string;
  [ConnectionSShFormikField.AskForPassphraseEachTime]: boolean;
  [ConnectionSShFormikField.Password]: string;
  [ConnectionSShFormikField.AskForPasswordEachTime]: boolean;
}

export interface ConnectionTlsFormikValues {
  [ConnectionTlsFormikField.Enabled]: boolean;
  [ConnectionTlsFormikField.AuthenticationMethod]: AuthenticationMethod;
  [ConnectionTlsFormikField.CaCertificate]?: FileData;
  [ConnectionTlsFormikField.UsePem]: boolean;
  [ConnectionTlsFormikField.Pem]?: FileData;
  [ConnectionTlsFormikField.Passphrase]: string;
  [ConnectionTlsFormikField.AskForPassphraseEachTime]: boolean;
  [ConnectionTlsFormikField.AdvancedOptions]: boolean;
  [ConnectionTlsFormikField.Crl]?: FileData;
  [ConnectionTlsFormikField.InvalidHostnames]: InvalidHostnames;
}

export interface ConnectionMainFormikValues {
  [ConnectionMainFormikField.Name]: string;
  [ConnectionMainFormikField.Type]: ConnectionType;
  [ConnectionMainFormikField.Addresses]: ConnectionData[];
  [ConnectionMainFormikField.SentinelName]: string;
  [ConnectionMainFormikField.ReadOnly]: boolean;
}

export interface ConnectionAuthFormikValues {
  [ConnectionAuthFormikField.PerformAuth]: boolean;
  [ConnectionAuthFormikField.Password]: string;
  [ConnectionAuthFormikField.Username]: string;
  [ConnectionAuthFormikField.SentinelPassword]: string;
}

export interface ConnectionAdvancedFormikValues {
  [ConnectionAdvancedFormikField.Family]: string;
  [ConnectionAdvancedFormikField.Db]: number;
  [ConnectionAdvancedFormikField.KeyPrefix]: string;
  [ConnectionAdvancedFormikField.StringNumbers]: boolean;
}

export interface ConnectionFormikValues {
  [ConnectionFormikField.Main]: ConnectionMainFormikValues;
  [ConnectionFormikField.Auth]: ConnectionAuthFormikValues;
  [ConnectionFormikField.Ssh]: ConnectionSShFormikValues;
  [ConnectionFormikField.Tls]: ConnectionTlsFormikValues;
  [ConnectionFormikField.Advanced]: ConnectionAdvancedFormikValues;
}

const defaultConnectionData: ConnectionFormikValues = {
  main: {
    name: 'New Connection',
    type: ConnectionType.Direct,
    addresses: [{ host: 'localhost', port: '6379' }],
    sentinelName: '',
    readOnly: false,
  },
  auth: {
    performAuth: false,
    password: '',
    username: '',
    sentinelPassword: '',
  },
  ssh: {
    enabled: false,
    host: '',
    port: '22',
    username: '',
    authMethod: SshAuthMethod.PrivateKey,
    passphrase: '',
    askForPassphraseEachTime: false,
    password: '',
    askForPasswordEachTime: false,
  },
  tls: {
    enabled: false,
    authenticationMethod: AuthenticationMethod.SelfSigned,
    usePem: false,
    passphrase: '',
    askForPassphraseEachTime: false,
    advancedOptions: false,
    invalidHostnames: InvalidHostnames.NotAllowed,
  },
  advanced: {
    family: '4',
    db: 0,
    keyPrefix: '',
    stringNumbers: false,
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
          ...this.connection,
        }
      : defaultConnectionData;
  }

  @action
  async createOrUpdateConnection(data: ConnectionFormikValues): Promise<void> {
    if (this.connection) {
      const connectionData = await connectionsClient.create(data);
    } else {
      // update connection
    }
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
