import React, { ReactElement } from 'react';

import { Modal } from 'components/modal';
import { Button } from 'components/button';

import { ConnectionsList } from 'scenes/connections-list';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ConnectionsListModal(props: Props): ReactElement {
  const { open, onClose } = props;

  function handleCreateConnection(): void {}

  return (
    <Modal open={open} onClose={onClose} title="Redis connections">
      <div>
        <Button onClick={handleCreateConnection}>Create</Button>
      </div>

      <ConnectionsList />
    </Modal>
  );
}
