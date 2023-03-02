import { makeObservable, action, observable, computed, runInAction } from 'mobx';

import { Connection, ConnectionType, SshAuthMethod, AuthenticationMethod, InvalidHostnames } from 'renderer/lib/db';
import { Redis, SshRedisAddress } from 'renderer/lib/redis';

import { ConnectionsStore, ConnectionStore } from 'renderer/stores';

import { ConnectionFormikValues } from './types';

interface Deps {
  connectionsStore: ConnectionsStore;
  connectionStore: ConnectionStore;
}

interface AskData {
  sshPassphrase?: boolean;
  sshPassword?: boolean;
  tlsPassphrase?: boolean;
}

interface AskDataValues {
  sshPassphrase?: string;
  sshPassword?: string;
  tlsPassphrase?: string;
}

const defaultConnectionData: ConnectionFormikValues = {
  main: {
    name: 'New Connection',
    type: ConnectionType.Direct,
    addresses: [{ host: 'localhost', port: '6379' }],
    sentinelName: '',
    readOnly: false,
  },
  auth: {
    performAuth: false,
    password: '',
    username: '',
    sentinelPassword: '',
    sentinelUsername: '',
  },
  ssh: {
    enabled: false,
    host: '',
    port: '22',
    username: '',
    authMethod: SshAuthMethod.PrivateKey,
    passphrase: '',
    askForPassphraseEachTime: false,
    password: '',
    askForPasswordEachTime: false,
  },
  tls: {
    enabled: false,
    authenticationMethod: AuthenticationMethod.CaCertificate,
    usePem: false,
    passphrase: '',
    askForPassphraseEachTime: false,
    advancedOptions: false,
    invalidHostnames: InvalidHostnames.NotAllowed,
  },
  advanced: {
    family: 4,
    db: 0,
    keyPrefix: '',
    stringNumbers: false,
  },
};

export class ConnectionModalStore {
  private _connectionsStore: ConnectionsStore;
  private _connectionStore: ConnectionStore;

  @observable
  private _redis?: Redis;

  @observable
  private _sshError?: Error;

  @observable
  private _connectError?: Error;

  @observable
  private _id?: string;

  @observable
  private _isSaving = false;

  @observable
  private _isLoading = true;

  @observable
  private _isConnecting = false;

  @observable
  private _showAskDataForm = false;

  @observable
  private _showConnectionResult = false;

  constructor(deps: Deps) {
    this._connectionsStore = deps.connectionsStore;
    this._connectionStore = deps.connectionStore;

    makeObservable(this);
  }

  @computed
  get isSaving(): boolean {
    return this._isSaving;
  }

  @computed
  get isLoading(): boolean {
    return this._isLoading;
  }

  @computed
  get showAskDataForm(): boolean {
    return this._showAskDataForm;
  }

  @computed
  get showConnectionResult(): boolean {
    return this._showConnectionResult;
  }

  @computed
  get connection(): Connection | undefined {
    return this._connectionsStore.connections?.find(({ id }) => id === this._id);
  }

  @computed
  get isConnecting(): boolean {
    return this._isConnecting;
  }

  @computed
  get initialValues(): ConnectionFormikValues {
    const connectionData = this.connection || defaultConnectionData;

    // eslint-disable-next-line
    const { id, ...rest } = connectionData as Connection;
    return JSON.parse(JSON.stringify(rest));
  }

  @computed
  get askData(): AskData {
    return {
      sshPassphrase: this._redis?.askForSshPassphraseEachTime,
      sshPassword: this._redis?.askForSshPasswordEachTime,
      tlsPassphrase: this._redis?.askForTlsPassphraseEachTime,
    };
  }

  @computed
  get sshError(): Error | undefined {
    return this._sshError;
  }

  @computed
  get connectError(): Error | undefined {
    return this._connectError;
  }

  @computed
  get shouldSshConnect(): boolean {
    return this._redis?.useSshTunnel || false;
  }

  @action
  onMounted(id?: string): void {
    this._id = id;
    this._isLoading = false;
  }

  @action
  async createOrUpdateConnection(data: ConnectionFormikValues): Promise<void> {
    this._isSaving = true;

    const connection = await this._connectionStore.createOrUpdate(data, this._id);
    this._connectionsStore.setConnection(connection);

    runInAction(() => {
      this._isSaving = false;
    });
  }

  @action
  setAskDataFormOpen(open: boolean): void {
    this._showAskDataForm = open;
  }

  @action
  createTestConnection(values: ConnectionFormikValues): void {
    this._redis = new Redis(values);
    if (this._redis.hasDataToAsk) {
      this._showAskDataForm = true;
    } else {
      this.testConnect();
    }
  }

  @action
  setConnectionResultOpen(open: boolean): void {
    this._showConnectionResult = open;
  }

  @action
  async testConnect(values: AskDataValues = {}): Promise<void> {
    if (!this._redis) {
      return;
    }

    const { askForSshPassphraseEachTime, askForSshPasswordEachTime, askForTlsPassphraseEachTime } = this._redis;

    if (askForSshPassphraseEachTime) {
      this._redis.setSshPassphrase(values.sshPassphrase || '');
    }
    if (askForSshPasswordEachTime) {
      this._redis.setSshPassword(values.sshPassword || '');
    }
    if (askForTlsPassphraseEachTime) {
      this._redis.setTlsPassphrase(values.tlsPassphrase || '');
    }

    this._showAskDataForm = false;
    this._isConnecting = true;
    this._showConnectionResult = true;
    this._connectError = undefined;
    this._sshError = undefined;

    let sshData: Record<string, SshRedisAddress>;
    try {
      sshData = await this._redis.connectSsh();
    } catch (error) {
      runInAction(() => {
        // TODO: fix type casting
        this._sshError = error as Error;
        this._isConnecting = false;
      });
      return;
    }

    try {
      await this._redis.connectRedis(sshData);
    } catch (error) {
      runInAction(() => {
        // TODO: fix type casting
        this._connectError = error as Error;
      });
    }

    runInAction(() => {
      this._isConnecting = false;
    });

    await this._redis.disconnect();
  }

  @action
  dispose(): void {
    this._id = undefined;
    this._isLoading = true;
  }
}
