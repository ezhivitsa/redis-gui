import React, { ReactElement } from 'react';

import { Connection } from 'lib/db';
import { useStyles } from 'lib/theme';

import { Modal } from 'components/modal';

import styles from './connection-modal.pcss';

interface Props {
  connection?: Connection;
  onClose?: () => void;
  open: boolean;
}

export function ConnectionModal({ open, connection, onClose }: Props): ReactElement {
  const cn = useStyles(styles, 'connection-modal');

  return (
    <Modal open={open} title={connection ? 'Edit connection' : 'Create connection'} className={cn()} onClose={onClose}>
      Connection
    </Modal>
  );
}
