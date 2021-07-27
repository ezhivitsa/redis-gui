import { Config as TunnelSshConfig } from 'tunnel-ssh';

import { Connection, ConnectionType } from 'lib/db';

import { getSshConfig, getRedisClusterConfig, getRedisDirectConfig, getRedisSentinelConfig } from './configs';
import { IoRedis, IoRedisCluster } from './ioredis';
import { TunnelSsh } from './tunnel-ssh';

import { BaseRedis } from './base-redis';

import { PrefixesAndKeys } from './types';

export class Redis {
  private _connection: Omit<Connection, 'id'>;

  private _sshPassphrase?: string;
  private _sshPassword?: string;
  private _tlsPassphrase?: string;

  private _tunnelSsh: TunnelSsh;
  private _ioRedis: BaseRedis;

  constructor(connection: Omit<Connection, 'id'>) {
    this._connection = connection;
    this._tunnelSsh = new TunnelSsh(this._sshConfig);

    if (this._connection.main.type === ConnectionType.Direct) {
      this._ioRedis = new IoRedis(getRedisDirectConfig(this._connection));
    } else if (this._connection.main.type === ConnectionType.Cluster) {
      this._ioRedis = new IoRedisCluster(...getRedisClusterConfig(this._connection));
    } else {
      this._ioRedis = new IoRedis(getRedisSentinelConfig(this._connection));
    }
  }

  private get _sshConfig(): TunnelSshConfig | undefined {
    const { ssh } = this._connection;
    if (!ssh.enabled) {
      return undefined;
    }

    return getSshConfig(ssh);
  }

  get askForSshPassphraseEachTime(): boolean {
    const { ssh } = this._connection;
    return ssh.enabled && ssh.askForPassphraseEachTime;
  }

  get askForSshPasswordEachTime(): boolean {
    const { ssh } = this._connection;
    return ssh.enabled && ssh.askForPasswordEachTime;
  }

  get askForTlsPassphraseEachTime(): boolean {
    const { tls } = this._connection;
    return tls.enabled && tls.askForPassphraseEachTime;
  }

  get hasDataToAsk(): boolean {
    return this.askForSshPassphraseEachTime || this.askForSshPasswordEachTime || this.askForTlsPassphraseEachTime;
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
    await this.connectSsh();
    await this.connectRedis();
  }

  async connectSsh(): Promise<void> {
    await this._tunnelSsh.connect({
      passphrase: this._sshPassphrase,
      password: this._sshPassword,
    });
  }

  async connectRedis(): Promise<void> {
    await this._ioRedis.connect({ tlsPassphrase: this._tlsPassphrase });
  }

  async disconnect(): Promise<void> {
    this._ioRedis.disconnect();
    await this._tunnelSsh.disconnect();
  }

  async getPrefixesAndKeys(prefix: string[] = []): Promise<PrefixesAndKeys> {
    if (!this._ioRedis) {
      return {
        keys: [],
        prefixes: [],
      };
    }

    return this._ioRedis.getPrefixesAndKeys(prefix);
  }
}
