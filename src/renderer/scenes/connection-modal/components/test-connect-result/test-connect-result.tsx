import React, { ReactElement, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { useStyles } from 'renderer/lib/theme';

import { Modal } from 'renderer/ui/modal';
import { Spinner, SpinnerView } from 'renderer/ui/spinner';
import { Paragraph, ParagraphSize } from 'renderer/ui/paragraph';

import { useStore } from 'renderer/scenes/connection-modal';

import { testConnectResultTexts } from 'texts';

import styles from './test-connect-result.pcss';

export const TestConnectResult = observer((): ReactElement => {
  const cn = useStyles(styles, 'test-connect-result');

  const store = useStore();
  const { showConnectionResult, isConnecting, connectError, sshError, shouldSshConnect } = store;

  function handleConnectionResultClose(): void {
    store.setConnectionResultOpen(false);
  }

  function renderMessage(icon: IconProp, iconType: string, message: ReactNode): ReactNode {
    return (
      <div className={cn('message')}>
        <FontAwesomeIcon size="1x" icon={icon} className={cn('icon', { type: iconType })} />
        <Paragraph size={ParagraphSize.S} className={cn('message-text')}>
          {message}
        </Paragraph>
      </div>
    );
  }

  function renderResult(prefix: string, error: Error | undefined): ReactNode {
    if (error) {
      return renderMessage(faExclamationCircle, 'danger', `${prefix}: ${error.message}`);
    }

    return renderMessage(faCheckCircle, 'success', `${prefix}: no errors`);
  }

  function renderContent(): ReactNode {
    if (isConnecting) {
      return <Spinner view={SpinnerView.Block} />;
    }

    return (
      <div className={cn('content')}>
        {shouldSshConnect && renderResult('SSH connection', sshError)}
        {(!shouldSshConnect || !sshError) && renderResult('Redis connection', connectError)}
      </div>
    );
  }

  return (
    <Modal
      title={testConnectResultTexts.title}
      open={showConnectionResult}
      onClose={handleConnectionResultClose}
      className={cn()}
    >
      {renderContent()}
    </Modal>
  );
});
