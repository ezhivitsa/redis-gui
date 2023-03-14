import { Connection } from 'main/lib/db';
import { KeyData, PrefixesAndKeys, SshRedisAddress } from 'main/lib/redis';

import { getBaseIpcRenderer } from '../renderer-base';
import { Channel } from '../types';

import { DataToAsk, IpcRendererRedis, RedisInvokeData } from './types';

const baseIpRenderer = getBaseIpcRenderer<never, never, RedisInvokeData>(Channel.REDIS);

export const redisRenderer: IpcRendererRedis = {
  createRedis(data: Omit<Connection, 'id'>): Promise<string> {
    return baseIpRenderer.invoke('CREATE_REDIS', data);
  },
  deleteRedis(id: string): Promise<void> {
    return baseIpRenderer.invoke('DELETE_REDIS', id);
  },
  getHasDataToAsk(id: string): Promise<boolean> {
    return baseIpRenderer.invoke('GET_HAS_DATA_TO_ASK', id);
  },
  getDataToAsk(id: string): Promise<DataToAsk> {
    return baseIpRenderer.invoke('GET_DATA_TO_ASK', id);
  },
  connectSsh(id: string): Promise<Record<string, SshRedisAddress>> {
    return baseIpRenderer.invoke('CONNECT_SSH', id);
  },
  connectRedis(data: { id: string; sshData: Record<string, SshRedisAddress> }): Promise<void> {
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
};
