import { BrowserWindow } from 'electron';

import { Connection } from 'main/lib/db';
import { Redis } from 'main/lib/redis';
import { KeyData, PrefixesAndKeys, SshRedisAddress } from 'main/lib/redis';

import { getIpcMainBase } from '../main-base';
import { Channel, IpcMainBase } from '../types';

import { RedisInvokeData } from './types';

const ipcMainBase = getIpcMainBase<never, never, RedisInvokeData>(Channel.REDIS);

const redisStore: Record<string, Redis> = {};

function getRedis(id: string): Redis {
  const redis = redisStore[id];
  if (!redis) {
    throw new Error(`redis for id ${id} doesn't exist`);
  }
  return redis;
}

async function handleCreateRedis(data: Omit<Connection, 'id'>): Promise<string> {
  const redis = new Redis(data);

  redisStore[redis.id] = redis;
  return redis.id;
}

async function handleDeleteRedis(id: string): Promise<void> {
  delete redisStore[id];
}

async function handleConnectSsh(id: string): Promise<Record<string, SshRedisAddress>> {
  return getRedis(id).connectSsh();
}

async function handleConnectRedis({
  id,
  sshData,
}: {
  id: string;
  sshData: Record<string, SshRedisAddress>;
}): Promise<void> {
  return getRedis(id).connectRedis(sshData);
}

async function handleDisconnect(id: string): Promise<void> {
  return getRedis(id).disconnect();
}

async function handleGetPrefixesAndKeys({ id, prefix }: { id: string; prefix: string[] }): Promise<PrefixesAndKeys> {
  return getRedis(id).getPrefixesAndKeys(prefix);
}

async function handleGetKeyData({ id, prefix }: { id: string; prefix: string[] }): Promise<KeyData | undefined> {
  return getRedis(id).getKeyData(prefix);
}

async function handleSetKeyData({ id, data }: { id: string; data: KeyData }): Promise<void> {
  return getRedis(id).setKeyData(data);
}

async function handleDeleteKey({ id, key }: { id: string; key: string }): Promise<void> {
  return getRedis(id).deleteKey(key);
}

async function handleSetSshPassphrase({ id, passphrase }: { id: string; passphrase: string }): Promise<void> {
  return getRedis(id).setSshPassphrase(passphrase);
}

async function handleSetSshPassword({ id, password }: { id: string; password: string }): Promise<void> {
  return getRedis(id).setSshPassword(password);
}

async function handleSetTlsPassphrase({ id, passphrase }: { id: string; passphrase: string }): Promise<void> {
  return getRedis(id).setTlsPassphrase(passphrase);
}

export const redisMain: IpcMainBase<never, never, RedisInvokeData> = {
  ...ipcMainBase,

  initialize(mainWindow: BrowserWindow): void {
    ipcMainBase.initialize(mainWindow);

    ipcMainBase.handle('CREATE_REDIS', handleCreateRedis);
    ipcMainBase.handle('DELETE_REDIS', handleDeleteRedis);
    ipcMainBase.handle('CONNECT_SSH', handleConnectSsh);
    ipcMainBase.handle('CONNECT_REDIS', handleConnectRedis);
    ipcMainBase.handle('DISCONNECT', handleDisconnect);
    ipcMainBase.handle('GET_PREFIXES_AND_KEYS', handleGetPrefixesAndKeys);
    ipcMainBase.handle('GET_KEY_DATA', handleGetKeyData);
    ipcMainBase.handle('SET_KEY_DATA', handleSetKeyData);
    ipcMainBase.handle('DELETE_KEY', handleDeleteKey);
    ipcMainBase.handle('SET_SSH_PASSPHRASE', handleSetSshPassphrase);
    ipcMainBase.handle('SET_SSH_PASSWORD', handleSetSshPassword);
    ipcMainBase.handle('SET_TLS_PASSPHRASE', handleSetTlsPassphrase);
  },
};
