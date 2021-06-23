import React, { ReactElement, useState } from 'react';

import { Connection } from 'lib/db';
import { useStyles } from 'lib/theme';

import { Modal } from 'components/modal';
import { Tabs, TabItem } from 'components/tabs';

import styles from './connection-modal.pcss';

enum ConnectionTab {
  Connection = 'connection',
  Authentication = 'authentication',
  Ssh = 'ssh',
  Tls = 'tls',
}

interface Props {
  connection?: Connection;
  onClose?: () => void;
  open: boolean;
}

const tabs: TabItem<ConnectionTab>[] = [
  {
    value: ConnectionTab.Connection,
    text: 'Connection',
  },
  {
    value: ConnectionTab.Authentication,
    text: 'Authentication',
  },
  {
    value: ConnectionTab.Ssh,
    text: 'SSH',
  },
  {
    value: ConnectionTab.Tls,
    text: 'TLS',
  },
];

export function ConnectionModal({ open, connection, onClose }: Props): ReactElement {
  const cn = useStyles(styles, 'connection-modal');
  const [activeTab, setActiveTab] = useState(ConnectionTab.Connection);

  return (
    <Modal open={open} title={connection ? 'Edit connection' : 'Create connection'} className={cn()} onClose={onClose}>
      <Tabs items={tabs} active={activeTab} onChange={setActiveTab} />
    </Modal>
  );
}
