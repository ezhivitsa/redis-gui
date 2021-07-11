import { DBSchema } from 'idb';

export enum AuthenticationMethod {
  SelfSigned = 'self-signed',
  CaCertificate = 'ca-certificate',
}

export enum InvalidHostnames {
  NotAllowed = 'not-allowed',
  Allowed = 'allowed',
}

export enum SshAuthMethod {
  PrivateKey = 'private-key',
  Password = 'password',
}

export enum ConnectionType {
  Direct = 'direct',
  Cluster = 'cluster',
  Sentinel = 'sentinel',
}

export interface FileData {
  name: string;
  text: string;
}

export interface ConnectionTls {
  enabled: boolean;
  authenticationMethod: AuthenticationMethod;
  ca?: FileData;
  usePem: boolean;
  pem?: FileData;
  passphrase: string;
  askForPassphraseEachTime: boolean;
  advancedOptions: boolean;
  crl?: FileData;
  invalidHostnames: InvalidHostnames;
}

export interface ConnectionSsh {
  enabled: boolean;
  host: string;
  port: string;
  username: string;
  authMethod: SshAuthMethod;
  privateKey?: FileData;
  passphrase: string;
  askForPassphraseEachTime: boolean;
  password: string;
  askForPasswordEachTime: boolean;
}

export interface ConnectionData {
  port: string;
  host: string;
}

export interface ConnectionMain {
  name: string;
  type: ConnectionType;
  addresses: ConnectionData[];
  sentinelName: string;
  readOnly: boolean;
}

export interface ConnectionAuth {
  performAuth: boolean;
  password: string;
  username: string;
  sentinelPassword: string;
}

export interface ConnectionAdvanced {
  family: string;
  db: number;
  keyPrefix: string;
  stringNumbers: boolean;
}

export interface Connection {
  id: number;
  main: ConnectionMain;
  auth: ConnectionAuth;
  ssh: ConnectionSsh;
  tls: ConnectionTls;
  advanced: ConnectionAdvanced;
}

export interface Db extends DBSchema {
  connections: {
    value: Connection;
    key: number;
  };
}
