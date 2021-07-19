import { promisify } from 'util';
import { Server } from 'net';

import tunnel, { Config as TunnelSshConfig } from 'tunnel-ssh';

const tunnelAsync = promisify(tunnel);

export class TunnelSsh {
  private _sshServer?: Server;

  constructor(private _config?: TunnelSshConfig) {}

  async connect(): Promise<void> {
    if (!this._config) {
      return;
    }

    this._sshServer = await tunnelAsync(this._config);
  }

  async disconnect(): Promise<void> {
    if (!this._sshServer) {
      return;
    }

    const closeAsync = promisify(this._sshServer.close);
    await closeAsync();
  }
}
