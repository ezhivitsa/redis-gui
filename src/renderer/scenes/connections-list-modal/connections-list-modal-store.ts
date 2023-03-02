import { makeObservable, observable, action, runInAction, computed } from 'mobx';

import { calculatePageState } from 'renderer/lib/page';
import { Connection } from 'renderer/lib/db';
import { Redis } from 'renderer/lib/redis';

import { PageState } from 'renderer/types';

import { ConnectionsStore } from 'renderer/stores';

interface Deps {
  connectionsStore: ConnectionsStore;
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

export class ConnectionsListModalStore {
  @observable
  private _isLoading = false;

  @observable
  private _isDeleting = false;

  @observable
  private _isCloning = false;

  @observable
  private _isConnecting = false;

  @observable
  private _showAskDataForm = false;

  @observable
  private _createConnectionOpened = false;

  @observable
  private _isConnected = false;

  @observable
  private _selectedConnectionId: string | null = null;

  @observable
  private _editConnectionId: string | null = null;

  @observable
  private _connectionsStore: ConnectionsStore;

  private _redis?: Redis;

  constructor(deps: Deps) {
    this._connectionsStore = deps.connectionsStore;

    makeObservable(this);
  }

  @computed
  get isDeleting(): boolean {
    return this._isDeleting;
  }

  @computed
  get isCloning(): boolean {
    return this._isCloning;
  }

  @computed
  get createConnectionOpened(): boolean {
    return this._createConnectionOpened;
  }

  @computed
  get sceneState(): PageState {
    return calculatePageState({
      loadingKeys: [this._isLoading],
      readyData: [this._connectionsStore.connections],
    });
  }

  @computed
  get selectedConnectionId(): string | undefined {
    return this._selectedConnectionId || undefined;
  }

  @computed
  get editConnectionId(): string | undefined {
    return this._editConnectionId || undefined;
  }

  @computed
  get selectedConnection(): Connection | null {
    return this._connectionsStore.connections?.find(({ id }) => id === this._selectedConnectionId) || null;
  }

  @computed
  get connections(): Connection[] {
    return this._connectionsStore.connections || [];
  }

  @computed
  get isConnecting(): boolean {
    return this._isConnecting;
  }

  @computed
  get showAskDataForm(): boolean {
    return this._showAskDataForm;
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
  get isConnected(): boolean {
    return this._isConnected;
  }

  get redis(): Redis | undefined {
    return this._redis;
  }

  @action
  async onMounted(): Promise<void> {
    this._isLoading = true;

    await this._connectionsStore.loadData();

    runInAction(() => {
      this._isLoading = false;
    });
  }

  @action
  async deleteConnection(): Promise<void> {
    if (!this._selectedConnectionId) {
      return;
    }

    this._isDeleting = true;

    await this._connectionsStore.deleteConnection(this._selectedConnectionId);

    runInAction(() => {
      this._isDeleting = false;
    });
  }

  @action
  setSelected(connection: Connection | null): void {
    this._selectedConnectionId = connection?.id || null;
  }

  @action
  setEdit(connection: Connection | null): void {
    this._selectedConnectionId = connection?.id || null;
  }

  @action
  setAskDataFormOpen(open: boolean): void {
    this._showAskDataForm = open;
  }

  @action
  openCreateModal(): void {
    this._editConnectionId = null;
    this._createConnectionOpened = true;
  }

  @action
  openEditModal(): void {
    if (this._selectedConnectionId === null) {
      return;
    }

    this._editConnectionId = this._selectedConnectionId;
    this._createConnectionOpened = true;
  }

  @action
  async cloneConnection(): Promise<void> {
    if (this._selectedConnectionId === null) {
      return;
    }

    this._isCloning = true;

    await this._connectionsStore.cloneConnection(this._selectedConnectionId);

    runInAction(() => {
      this._isCloning = false;
    });
  }

  @action
  openConnection(): void {
    if (!this.selectedConnection) {
      return;
    }

    this._redis = new Redis(this.selectedConnection);
    if (this._redis.hasDataToAsk) {
      this._showAskDataForm = true;
    } else {
      this.connect();
    }
  }

  @action
  async connect(values: AskDataValues = {}): Promise<void> {
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

    this._isConnecting = true;
    this._isConnected = false;
    this._showAskDataForm = false;

    await this._redis.connect();

    runInAction(() => {
      this._isConnecting = false;
      this._isConnected = true;
    });
  }

  @action
  dispose(): void {
    this._isLoading = false;
    this._isDeleting = false;
    this._isConnecting = false;
    this._showAskDataForm = false;
    this._isConnected = false;
    this._selectedConnectionId = null;
    this._redis = undefined;

    this._connectionsStore.dispose();
  }

  @action
  setCreateConnectionOpened(opened: boolean): void {
    this._createConnectionOpened = opened;
  }
}
