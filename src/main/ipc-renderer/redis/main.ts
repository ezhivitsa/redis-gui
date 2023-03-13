import { BrowserWindow, nativeTheme } from 'electron';

import { Connection } from 'main/lib/db';
import { Redis } from 'main/lib/redis';

import { getIpcMainBase } from '../main-base';
import { Channel, IpcMainBase } from '../types';

import { DataToAsk, RedisInvokeData } from './types';

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

async function handleGetHasDataToAsk(id: string): Promise<boolean> {
  return getRedis(id).hasDataToAsk;
}

async function handleGetDataToAsk(id: string): Promise<DataToAsk> {
  const redis = getRedis(id);
  return {
    askForSshPassphraseEachTime: redis.askForSshPassphraseEachTime,
    askForSshPasswordEachTime: redis.askForSshPasswordEachTime,
    askForTlsPassphraseEachTime: redis.askForTlsPassphraseEachTime,
  };
}

export const nativeThemeMain: IpcMainBase<never, never, RedisInvokeData> = {
  ...ipcMainBase,

  initialize(mainWindow: BrowserWindow): void {
    ipcMainBase.initialize(mainWindow);

    ipcMainBase.handle('CREATE_REDIS', handleCreateRedis);
    ipcMainBase.handle('DELETE_REDIS', handleDeleteRedis);
    ipcMainBase.handle('GET_HAS_DATA_TO_ASK', handleGetHasDataToAsk);
    ipcMainBase.handle('GET_DATA_TO_ASK', handleGetDataToAsk);

    // GET_DATA_TO_ASK
    // CONNECT_SSH
    // CONNECT_REDIS
    // DISCONNECT
    // GET_PREFIXES_AND_KEYS
    // GET_KEY_DATA
    // SET_KEY_DATA
    // DELETE_KEY
  },
};
