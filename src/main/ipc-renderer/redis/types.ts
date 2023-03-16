import { Connection } from 'data';

import { AskedRedisAuthData, KeyData, PrefixesAndKeys, SshRedisAddress } from 'main/lib/redis';

import { BaseInvokeEvent } from '../types';

export interface BaseRedis {
  connect(sshData: Record<string, SshRedisAddress>, data: AskedRedisAuthData): Promise<void>;
  disconnect(): void;
}

export type RedisInvokeData =
  | BaseInvokeEvent<'CREATE_REDIS', Omit<Connection, 'id'>, string>
  | BaseInvokeEvent<'DELETE_REDIS', string, void>
  | BaseInvokeEvent<'CONNECT_SSH', string, Record<string, SshRedisAddress>>
  | BaseInvokeEvent<'CONNECT_REDIS', { id: string; sshData: Record<string, SshRedisAddress> }, void>
  | BaseInvokeEvent<'DISCONNECT', string, void>
  | BaseInvokeEvent<'GET_PREFIXES_AND_KEYS', { id: string; prefix: string[] }, PrefixesAndKeys>
  | BaseInvokeEvent<'GET_KEY_DATA', { id: string; prefix: string[] }, KeyData | undefined>
  | BaseInvokeEvent<'SET_KEY_DATA', { id: string; data: KeyData }, void>
  | BaseInvokeEvent<'DELETE_KEY', { id: string; key: string }, void>
  | BaseInvokeEvent<'SET_SSH_PASSPHRASE', { id: string; passphrase: string }, void>
  | BaseInvokeEvent<'SET_SSH_PASSWORD', { id: string; password: string }, void>
  | BaseInvokeEvent<'SET_TLS_PASSPHRASE', { id: string; passphrase: string }, void>;

export interface IpcRendererRedis {
  createRedis(data: Omit<Connection, 'id'>): Promise<string>;
  deleteRedis(id: string): Promise<void>;
  connectSsh(id: string): Promise<Record<string, SshRedisAddress>>;
  connectRedis(data: { id: string; sshData: Record<string, SshRedisAddress> }): Promise<void>;
  disconnect(id: string): Promise<void>;
  getPrefixesAndKeys(data: { id: string; prefix: string[] }): Promise<PrefixesAndKeys>;
  getKeyData(data: { id: string; prefix: string[] }): Promise<KeyData | undefined>;
  setKeyData(data: { id: string; data: KeyData }): Promise<void>;
  deleteKey(data: { id: string; key: string }): Promise<void>;
  setSshPassphrase(data: { id: string; passphrase: string }): Promise<void>;
  setSshPassword(data: { id: string; password: string }): Promise<void>;
  setTlsPassphrase(data: { id: string; passphrase: string }): Promise<void>;
}

// import { ConnectConfig as SshConfig } from 'ssh2';
// import { v4 as uuidv4 } from 'uuid';

// import { Connection, ConnectionType } from 'renderer/lib/db';

// import { BaseRedis } from './base-redis';
// import { getRedisClusterConfig, getRedisDirectConfig, getRedisSentinelConfig, getSshConfig } from './configs';
// import { IoRedis, IoRedisCluster } from './ioredis';
// import { TunnelSsh } from './tunnel-ssh';
// import { KeyData, PrefixesAndKeys, SshRedisAddress } from './types';

// export class Redis {
//   private _id: string;
//   private _connection: Omit<Connection, 'id'>;

//   private _sshPassphrase?: string;
//   private _sshPassword?: string;
//   private _tlsPassphrase?: string;

//   private _tunnelSsh: TunnelSsh;
//   private _ioRedis: BaseRedis<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

//   constructor(connection: Omit<Connection, 'id'>) {
//     this._id = uuidv4();

//     this._connection = connection;
//     this._tunnelSsh = new TunnelSsh(this._sshConfig);

//     if (this._connection.main.type === ConnectionType.Direct) {
//       this._ioRedis = new IoRedis(getRedisDirectConfig(this._connection));
//     } else if (this._connection.main.type === ConnectionType.Cluster) {
//       this._ioRedis = new IoRedisCluster(...getRedisClusterConfig(this._connection));
//     } else {
//       this._ioRedis = new IoRedis(getRedisSentinelConfig(this._connection));
//     }
//   }

//   private get _sshConfig(): SshConfig | undefined {
//     const { ssh } = this._connection;
//     if (!ssh.enabled) {
//       return undefined;
//     }

//     return getSshConfig(ssh);
//   }

//   get id(): string {
//     return this._id;
//   }

//   get askForSshPassphraseEachTime(): boolean {
//     const { ssh } = this._connection;
//     return ssh.enabled && ssh.askForPassphraseEachTime;
//   }

//   get askForSshPasswordEachTime(): boolean {
//     const { ssh } = this._connection;
//     return ssh.enabled && ssh.askForPasswordEachTime;
//   }

//   get askForTlsPassphraseEachTime(): boolean {
//     const { tls } = this._connection;
//     return tls.enabled && tls.askForPassphraseEachTime;
//   }

//   get hasDataToAsk(): boolean {
//     return this.askForSshPassphraseEachTime || this.askForSshPasswordEachTime || this.askForTlsPassphraseEachTime;
//   }

//   get useSshTunnel(): boolean {
//     return this._connection.ssh.enabled;
//   }

//   get name(): string {
//     return this._connection.main.name;
//   }

//   setSshPassphrase(passphrase: string): void {
//     this._sshPassphrase = passphrase;
//   }

//   setSshPassword(password: string): void {
//     this._sshPassword = password;
//   }

//   setTlsPassphrase(passphrase: string): void {
//     this._tlsPassphrase = passphrase;
//   }

//   async connect(): Promise<void> {
//     const sshResultData = await this.connectSsh();
//     await this.connectRedis(sshResultData);
//   }

//   connectSsh(): Promise<Record<string, SshRedisAddress>> {
//     return this._tunnelSsh.connect(this._connection.main, {
//       passphrase: this._sshPassphrase,
//       password: this._sshPassword,
//     });
//   }

//   async connectRedis(sshResultData: Record<string, SshRedisAddress>): Promise<void> {
//     await this._ioRedis.connect(sshResultData, { tlsPassphrase: this._tlsPassphrase });
//   }

//   async disconnect(): Promise<void> {
//     this._ioRedis.disconnect();
//     await this._tunnelSsh.disconnect();
//   }

//   async getPrefixesAndKeys(prefix: string[] = []): Promise<PrefixesAndKeys> {
//     if (!this._ioRedis) {
//       return {
//         keys: [],
//         prefixes: {},
//       };
//     }

//     return this._ioRedis.getPrefixesAndKeys(prefix);
//   }

//   async getKeyData(prefix: string[] = []): Promise<KeyData | undefined> {
//     if (!this._ioRedis) {
//       return;
//     }

//     return this._ioRedis.getKeyData(prefix);
//   }

//   async setKeyData(data: KeyData): Promise<void> {
//     if (!this._ioRedis) {
//       return;
//     }

//     return this._ioRedis.setKeyData(data);
//   }

//   async deleteKey(key: string): Promise<void> {
//     if (!this._ioRedis) {
//       return;
//     }

//     await this._ioRedis.deleteKey(key);
//   }
// }
