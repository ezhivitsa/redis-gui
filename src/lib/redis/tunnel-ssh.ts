import { Server, createServer, AddressInfo } from 'net';
import { Client, ConnectConfig } from 'ssh2';

import { ConnectionMain } from 'lib/db';

import { AskedSshAuthData, SshRedisAddress } from './types';

const LOCAL_HOST = '127.0.0.1';

export class TunnelSsh {
  private _sshServer?: Server;
  private _config?: ConnectConfig;

  constructor(config?: ConnectConfig) {
    this._config = config;
  }

  private _sshConnect(data: AskedSshAuthData, host?: string, port?: number): Promise<SshRedisAddress | undefined> {
    return new Promise((resolve, reject) => {
      if (!this._config || !host || !port) {
        resolve(undefined);
        return;
      }

      const config: ConnectConfig = {
        ...this._config,
        password: this._config.password || data.password,
        passphrase: this._config.passphrase || data.passphrase,
      };

      const conn = new Client();
      conn
        .on('ready', () => {
          const server = (this._sshServer = createServer(function (sock) {
            const { remoteAddress, remotePort } = sock;
            if (!remoteAddress || !remotePort) {
              return;
            }

            conn.forwardOut(remoteAddress, remotePort, host, port, (err, stream) => {
              if (err) {
                sock.end();
              } else {
                sock.pipe(stream).pipe(sock);
              }
            });
          }).listen(0, function () {
            resolve({
              originalHost: host,
              originalPort: port,
              host: LOCAL_HOST,
              port: (server.address() as AddressInfo).port,
            });
          }));
        })
        .on('error', (err) => {
          reject(err);
        });

      conn.connect(config);
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
    });
  }
}
