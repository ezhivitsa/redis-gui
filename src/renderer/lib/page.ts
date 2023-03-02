import { PageState, AnyError } from 'renderer/types';

interface StateData {
  loadingKeys: boolean[];
  errorKeys?: (AnyError | null)[];
  readyData?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function calculatePageState({ loadingKeys, errorKeys, readyData }: StateData): PageState {
  if (loadingKeys.some(Boolean)) {
    return PageState.LOADING;
  }

  if (errorKeys?.some((error) => error !== null)) {
    return PageState.ERROR;
  }

  if (readyData === undefined || readyData.every((data) => data !== undefined && data !== null)) {
    return PageState.READY;
  }

  return PageState.ERROR;
}
