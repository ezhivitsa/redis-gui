import { Config as TunnelSshConfig } from 'tunnel-ssh';
import { RedisOptions } from 'ioredis';

import { Connection } from 'lib/db';

import { getSshConfig, getRedisConfig } from './configs';
import { IoRedis } from './ioredis';
import { TunnelSsh } from './tunnel-ssh';

export class Redis {
  private _sshPassphrase?: string;
  private _sshPassword?: string;
  private _tlsPassphrase?: string;

  private _tunnelSsh: TunnelSsh;
  private _ioRedis: IoRedis;

  constructor(private _connection: Connection) {
    this._ioRedis = new IoRedis(this._redisConfig);
    this._tunnelSsh = new TunnelSsh(this._sshConfig);
  }

  private get _sshConfig(): TunnelSshConfig | undefined {
    const { ssh } = this._connection;
    if (!ssh.enabled) {
      return undefined;
    }

    return getSshConfig(ssh);
  }

  private get _redisConfig(): RedisOptions {
    const { main, advanced, auth, tls } = this._connection;

    return getRedisConfig({ main, advanced, auth, tls });
  }

  get askForSshPassphraseEachTime(): boolean {
    const { ssh } = this._connection;
    return ssh.enabled && ssh.askForPassphraseEachTime;
  }

  get askForSshPasswordEachTime(): boolean {
    const { ssh } = this._connection;
    return ssh.enabled && ssh.askForPasswordEachTime;
  }

  get useSshTunnel(): boolean {
    return this._connection.ssh.enabled;
  }

  setSshPassphrase(passphrase: string): void {
    this._sshPassphrase = passphrase;
  }

  setSshPassword(password: string): void {
    this._sshPassword = password;
  }

  setTlsPassphrase(passphrase: string): void {
    this._tlsPassphrase = passphrase;
  }

  async connect(): Promise<void> {
    await this._tunnelSsh.connect();
    await this._ioRedis.connect();
  }

  async disconnect(): Promise<void> {
    this._ioRedis.disconnect();
    await this._tunnelSsh.disconnect();
  }
}
