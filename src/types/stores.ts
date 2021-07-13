import { PageState } from './page';

export abstract class SceneStore<
  CollectedProps extends Record<string, any> = Record<string, any>,
  OwnProps extends Record<string, any> = Record<string, any>,
> {
  get sceneState(): PageState | null {
    return null;
  }

  abstract collectProps(ownProps: OwnProps): CollectedProps;

  onMounted(): void {
    return;
  }
}
