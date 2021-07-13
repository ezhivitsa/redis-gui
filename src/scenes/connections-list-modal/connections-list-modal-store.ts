import { makeObservable, observable, action, runInAction } from 'mobx';

import { calculatePageState } from 'lib/page';
import { Connection } from 'lib/db';

import { SceneStore, PageState } from 'types';

import { ConnectionsStore } from 'stores';

import { Props } from './types';

interface Deps {
  connectionsStore: ConnectionsStore;
}

export class ConnectionsListModalStore extends SceneStore<Props> {
  @observable
  private _isLoading = false;

  @observable
  private _isDeleting = false;

  @observable
  private _selectedConnection: number | null = null;

  @observable
  private _connectionsStore: ConnectionsStore;

  constructor(deps: Deps) {
    super();

    this._connectionsStore = deps.connectionsStore;

    makeObservable(this);
  }

  get sceneState(): PageState {
    return calculatePageState({
      loadingKeys: [this._isLoading],
      readyData: [this._connectionsStore.connections],
    });
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
    if (!this._selectedConnection) {
      return;
    }

    this._isDeleting = true;

    await this._connectionsStore.deleteConnection(this._selectedConnection);

    runInAction(() => {
      this._isDeleting = false;
    });
  }

  @action
  setSelected(connection: Connection | null): void {
    this._selectedConnection = connection?.id || null;
  }

  @action
  dispose(): void {
    this._isLoading = false;
    this._isDeleting = false;
    this._selectedConnection = null;

    this._connectionsStore.dispose();
  }

  collectProps(): Props {
    return {
      onMounted: this.onMounted,
      setSelected: this.setSelected,
      dispose: this.dispose,
      sceneState: this.sceneState,
      isDeleting: this._isDeleting,
      connections: this._connectionsStore.connections,
    };
  }
}
