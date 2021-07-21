import { promisify } from 'util';
import { Server } from 'net';

import tunnel, { Config as TunnelSshConfig } from 'tunnel-ssh';

import { AskedSshAuthData } from './types';

const tunnelAsync = promisify(tunnel);

export class TunnelSsh {
  private _sshServer?: Server;

  constructor(private _config?: TunnelSshConfig) {}

  async connect(data: AskedSshAuthData): Promise<void> {
    if (!this._config) {
      return;
    }

    const config: TunnelSshConfig = {
      ...this._config,
      password: this._config.password || data.password,
      passphrase: this._config.passphrase || data.passphrase,
    };

    this._sshServer = await tunnelAsync(config);
  }

  async disconnect(): Promise<void> {
    if (!this._sshServer) {
      return;
    }

    const closeAsync = promisify(this._sshServer.close);
    await closeAsync();
  }
}
