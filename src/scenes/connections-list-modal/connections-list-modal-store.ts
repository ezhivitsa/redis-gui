import { makeObservable, observable, action, runInAction, computed } from 'mobx';

import { calculatePageState } from 'lib/page';
import { Connection } from 'lib/db';

import { PageState } from 'types';

import { ConnectionsStore } from 'stores';

interface Deps {
  connectionsStore: ConnectionsStore;
}

export class ConnectionsListModalStore {
  @observable
  private _isLoading = false;

  @observable
  private _isDeleting = false;

  @observable
  private _isCloning = false;

  @observable
  private _createConnectionOpened = false;

  @observable
  private _selectedConnectionId: string | null = null;

  @observable
  private _editConnectionId: string | null = null;

  @observable
  private _connectionsStore: ConnectionsStore;

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
  dispose(): void {
    this._isLoading = false;
    this._isDeleting = false;
    this._selectedConnectionId = null;

    this._connectionsStore.dispose();
  }

  @action
  setCreateConnectionOpened(opened: boolean): void {
    this._createConnectionOpened = opened;
  }
}
