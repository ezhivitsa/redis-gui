import { assertExists } from 'main/lib/assert';
import { Connection } from 'main/lib/db';
import { KeyData, PrefixesAndKeys, SshRedisAddress } from 'main/lib/redis';

export class Redis {
  private _id?: string;
  private _connection: Omit<Connection, 'id'>;

  constructor(connection: Omit<Connection, 'id'>) {
    this._connection = connection;
  }

  async init(): Promise<void> {
    this._id = await window.electron.redis.createRedis(this._connection);
  }

  async delete(): Promise<void> {
    await window.electron.redis.deleteRedis(this.id);
  }

  get id(): string {
    assertExists(this._id);
    return this._id;
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

  get name(): string {
    return this._connection.main.name;
  }

  async setSshPassphrase(passphrase: string): Promise<void> {
    return window.electron.redis.setSshPassphrase({ id: this.id, passphrase });
  }

  async setSshPassword(password: string): Promise<void> {
    return window.electron.redis.setSshPassword({ id: this.id, password });
  }

  async setTlsPassphrase(passphrase: string): Promise<void> {
    return window.electron.redis.setTlsPassphrase({ id: this.id, passphrase });
  }

  // async connect(): Promise<void> {
  //   const sshResultData = await window.electron.redis.connectSsh(this.id);
  //   return window.electron.redis.connectRedis({ id: this.id, sshData: sshResultData });
  // }

  // async connect(): Promise<void> {
  //   const sshResultData = await window.electron.redis.connectSsh(this.id);
  //   return window.electron.redis.connectRedis({ id: this.id, sshData: sshResultData });
  // }

  async connect(): Promise<void> {
    const sshResultData = await this.connectSsh();
    await this.connectRedis(sshResultData);
  }

  connectSsh(): Promise<Record<string, SshRedisAddress>> {
    return window.electron.redis.connectSsh(this.id);
  }

  async connectRedis(sshResultData: Record<string, SshRedisAddress>): Promise<void> {
    return window.electron.redis.connectRedis({ id: this.id, sshData: sshResultData });
  }

  async disconnect(): Promise<void> {
    return window.electron.redis.disconnect(this.id);
  }

  async getPrefixesAndKeys(prefix: string[] = []): Promise<PrefixesAndKeys> {
    return window.electron.redis.getPrefixesAndKeys({ id: this.id, prefix });
  }

  async getKeyData(prefix: string[] = []): Promise<KeyData | undefined> {
    return window.electron.redis.getKeyData({ id: this.id, prefix });
  }

  async setKeyData(data: KeyData): Promise<void> {
    return window.electron.redis.setKeyData({ id: this.id, data });
  }

  async deleteKey(key: string): Promise<void> {
    return window.electron.redis.deleteKey({ id: this.id, key });
  }
}
