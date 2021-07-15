import { PageState } from './page';

export abstract class SceneStore {
  get sceneState(): PageState | null {
    return null;
  }
}
