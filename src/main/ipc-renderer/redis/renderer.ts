import { Connection } from 'data';

import { KeyData, PrefixesAndKeys, SshRedisAddress } from 'main/lib/redis';

import { getBaseIpcRenderer } from '../renderer-base';
import { Channel } from '../types';

import { IpcRendererRedis, RedisInvokeData } from './types';

const baseIpRenderer = getBaseIpcRenderer<never, never, RedisInvokeData>(Channel.REDIS);

export const redisRenderer: IpcRendererRedis = {
  createRedis(data: Omit<Connection, 'id'>): Promise<string> {
    return baseIpRenderer.invoke('CREATE_REDIS', data);
  },
  deleteRedis(id: string): Promise<void> {
    return baseIpRenderer.invoke('DELETE_REDIS', id);
  },
  connectSsh(id: string): Promise<{ data?: Record<string, SshRedisAddress>; error?: string }> {
    return baseIpRenderer.invoke('CONNECT_SSH', id);
  },
  disconnectSsh(id: string): Promise<void> {
    return baseIpRenderer.invoke('DISCONNECT_SSH', id);
  },
  connectRedis(data: { id: string; sshData: Record<string, SshRedisAddress> }): Promise<{ error?: string }> {
    return baseIpRenderer.invoke('CONNECT_REDIS', data);
  },
  disconnect(id: string): Promise<void> {
    return baseIpRenderer.invoke('DISCONNECT', id);
  },
  getPrefixesAndKeys(data: { id: string; prefix: string[] }): Promise<PrefixesAndKeys> {
    return baseIpRenderer.invoke('GET_PREFIXES_AND_KEYS', data);
  },
  getKeyData(data: { id: string; prefix: string[] }): Promise<KeyData | undefined> {
    return baseIpRenderer.invoke('GET_KEY_DATA', data);
  },
  setKeyData(data: { id: string; data: KeyData }): Promise<void> {
    return baseIpRenderer.invoke('SET_KEY_DATA', data);
  },
  deleteKey(data: { id: string; key: string }): Promise<void> {
    return baseIpRenderer.invoke('DELETE_KEY', data);
  },
  setSshPassphrase(data: { id: string; passphrase: string }): Promise<void> {
    return baseIpRenderer.invoke('SET_SSH_PASSPHRASE', data);
  },
  setSshPassword(data: { id: string; password: string }): Promise<void> {
    return baseIpRenderer.invoke('SET_SSH_PASSWORD', data);
  },
  setTlsPassphrase(data: { id: string; passphrase: string }): Promise<void> {
    return baseIpRenderer.invoke('SET_TLS_PASSPHRASE', data);
  },
};
