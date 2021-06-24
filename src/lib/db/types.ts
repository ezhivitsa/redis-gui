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
}

export interface ConnectionTls {
  enabled: boolean;
  authenticationMethod: AuthenticationMethod;
  ca?: string;
  usePem: boolean;
  pem?: string;
  passphrase?: string;
  askForPassphraseEachTime: boolean;
  crl?: string;
  invalidHostnames: InvalidHostnames;
}

export interface ConnectionSsh {
  enabled: boolean;
  host?: string;
  port?: string;
  username?: string;
  authMethod: SshAuthMethod;
  privateKey?: string;
  passphrase?: string;
  askForPassphraseEachTime: boolean;
  password?: string;
  askForPasswordEachTime: boolean;
}

export interface Connection {
  id: number;
  name?: string;

  type: ConnectionType;
  post?: number;
  host?: string;
  family?: string;
  db?: number;
  password?: string;
  username?: string;
  keyPrefix?: string;
  readOnly: boolean;
  stringNumbers?: boolean;

  ssh?: ConnectionSsh;
  tls?: ConnectionTls;
}

export interface DbSchema {
  connections: Connection;
}
