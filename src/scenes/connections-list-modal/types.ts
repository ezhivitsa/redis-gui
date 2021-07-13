import { PageState } from 'types';

import { Connection } from 'lib/db';

export interface Props {
  onMounted: () => void;
  setSelected: (connection: Connection | null) => void;
  dispose: () => void;
  sceneState: PageState;
  isDeleting: boolean;
  connections: Connection[] | null;
}
