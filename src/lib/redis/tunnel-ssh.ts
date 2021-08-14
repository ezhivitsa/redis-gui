import { Server } from 'net';

import tunnel, { Config as TunnelSshConfig } from 'tunnel-ssh';

import { AskedSshAuthData } from './types';
export class TunnelSsh {
  private _sshServer?: Server;
  private _config?: TunnelSshConfig;

  constructor(config?: TunnelSshConfig) {
    this._config = config;
  }

  async connect(data: AskedSshAuthData): Promise<void> {
    if (!this._config) {
      return;
    }

    const config: TunnelSshConfig = {
      ...this._config,
      password: this._config.password || data.password,
      passphrase: this._config.passphrase || data.passphrase,
    };

    return new Promise((resolve, reject) => {
      tunnel(config, (err, server) => {
        if (err) {
          reject(err);
          return;
        }

        this._sshServer = server;
        resolve();
      });
    });
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
