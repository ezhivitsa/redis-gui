import { AddressInfo, Server } from 'net';
import { Client, ConnectConfig } from 'ssh2';

import { ConnectionMain } from 'data';

import { createTunnel } from '../tunnel-ssh';

import { AskedSshAuthData, SshRedisAddress } from './types';

const LOCAL_HOST = '127.0.0.1';

// Initial port for creating ssh server
let PORT = 40000;

export class TunnelSsh {
  private _sshServer?: Server;
  private _sshClient?: Client;
  private _config?: ConnectConfig;

  constructor(config?: ConnectConfig) {
    this._config = config;
  }

  private _sshConnect(data: AskedSshAuthData, host?: string, port?: number): Promise<SshRedisAddress | undefined> {
    if (!this._config || !host || !port) {
      return Promise.resolve(undefined);
    }

    const config: ConnectConfig = {
      ...this._config,
      password: this._config.password || data.password,
      passphrase: this._config.passphrase || data.passphrase,
    };

    return createTunnel({ autoClose: true }, { port: PORT++ }, config, {
      srcAddr: LOCAL_HOST,
      srcPort: port,
      dstAddr: host,
      dstPort: port,
    }).then(([server, client]) => {
      this._sshServer = server;
      this._sshClient = client;

      return {
        originalHost: host,
        originalPort: port,
        host: LOCAL_HOST,
        port: (server.address() as AddressInfo).port,
      };
    });
  }

  async connect(main: ConnectionMain, data: AskedSshAuthData): Promise<Record<string, SshRedisAddress>> {
    const result: Record<string, SshRedisAddress> = {};

    const connectResult = await Promise.all(
      main.addresses.map(({ host, port }) => this._sshConnect(data, host, port ? Number(port) : undefined)),
    );

    connectResult.forEach((resData) => {
      if (resData) {
        result[`${resData.host}:${resData.port}`] = resData;
      }
    });

    return result;
  }

  async disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._sshClient?.end();

      if (!this._sshServer) {
        resolve();
        return;
      }

      this._sshServer.close((err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
      this._sshServer = undefined;
      this._sshClient = undefined;
    });
  }
}
