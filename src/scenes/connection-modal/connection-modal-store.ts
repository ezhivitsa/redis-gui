import { makeObservable, action, observable, computed, runInAction } from 'mobx';

import { Connection, ConnectionType, SshAuthMethod, AuthenticationMethod, InvalidHostnames } from 'lib/db';

import { ConnectionsStore, ConnectionStore } from 'stores';

import { ConnectionFormikValues } from './types';

interface Deps {
  connectionsStore: ConnectionsStore;
  connectionStore: ConnectionStore;
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
    family: '4',
    db: 0,
    keyPrefix: '',
    stringNumbers: false,
  },
};

export class ConnectionModalStore {
  private _connectionsStore: ConnectionsStore;
  private _connectionStore: ConnectionStore;

  @observable
  private _id?: string;

  @observable
  private _isSaving = false;

  @observable
  private _isLoading = true;

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
  get connection(): Connection | undefined {
    return this._connectionsStore.connections?.find(({ id }) => id === this._id);
  }

  @computed
  get initialValues(): ConnectionFormikValues {
    const connectionData = this.connection || defaultConnectionData;

    const { id, ...rest } = connectionData as Connection;
    return JSON.parse(JSON.stringify(rest));
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
  dispose(): void {
    this._id = undefined;
    this._isLoading = true;
  }
}
