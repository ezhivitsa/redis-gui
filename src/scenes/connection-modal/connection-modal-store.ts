import { makeObservable, action, observable, computed, runInAction } from 'mobx';

import { Connection, ConnectionType, SshAuthMethod, AuthenticationMethod, InvalidHostnames } from 'lib/db';

import { ConnectionsStore, ConnectionStore } from 'stores';

import { SceneStore } from 'types';

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

export class ConnectionModalStore extends SceneStore {
  private _connectionsStore: ConnectionsStore;
  private _connectionStore: ConnectionStore;

  @observable
  private _id?: number;

  @observable
  private _isSaving = false;

  constructor(deps: Deps) {
    super();

    this._connectionsStore = deps.connectionsStore;
    this._connectionStore = deps.connectionStore;

    makeObservable(this);
  }

  @computed
  get isSaving(): boolean {
    return this._isSaving;
  }

  @computed
  get connection(): Connection | undefined {
    return this._connectionsStore.connections?.find(({ id }) => id === this._id);
  }

  @computed
  get initialValues(): ConnectionFormikValues {
    return this.connection ? { ...this.connection } : defaultConnectionData;
  }

  @action
  onMounted(id?: number): void {
    this._id = id;
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
  }
}
