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
  | BaseInvokeEvent<'DISCONNECT_SSH', string, void>
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
  disconnectSsh(id: string): Promise<void>;
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
