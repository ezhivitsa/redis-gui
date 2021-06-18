import React, { ReactElement } from 'react';

import { Modal } from 'components/modal';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ConnectionsListModal(props: Props): ReactElement {
  const { open, onClose } = props;

  return (
    <Modal open={open} onClose={onClose} title="Redis connections">
      <div>List</div>
    </Modal>
  );
}
