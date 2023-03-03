import {
  AuthenticationMethod,
  ConnectionData,
  ConnectionType,
  FileData,
  InvalidHostnames,
  SshAuthMethod,
} from 'renderer/lib/db';

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
  SentinelUsername = 'sentinelUsername',
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
  [ConnectionAuthFormikField.SentinelUsername]: string;
}

export interface ConnectionAdvancedFormikValues {
  [ConnectionAdvancedFormikField.Family]: number;
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
