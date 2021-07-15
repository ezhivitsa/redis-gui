import { makeObservable, observable, action, runInAction, computed } from 'mobx';

import { calculatePageState } from 'lib/page';
import { Connection } from 'lib/db';

import { SceneStore, PageState } from 'types';

import { ConnectionsStore } from 'stores';

interface Deps {
  connectionsStore: ConnectionsStore;
}

export class ConnectionsListModalStore extends SceneStore {
  @observable
  private _isLoading = false;

  @observable
  private _isDeleting = false;

  @observable
  private _createConnectionOpened = false;

  @observable
  private _selectedConnectionId: number | null = null;

  @observable
  private _connectionsStore: ConnectionsStore;

  constructor(deps: Deps) {
    super();

    this._connectionsStore = deps.connectionsStore;

    makeObservable(this);
  }

  @computed
  get isDeleting(): boolean {
    return this._isDeleting;
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
  get selectedConnectionId(): number | undefined {
    return this._selectedConnectionId || undefined;
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
