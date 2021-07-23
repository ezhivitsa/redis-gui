import React, { ReactElement, ReactNode } from 'react';
import { faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { useStyles } from 'lib/theme';

import { Modal } from 'ui/modal';
import { Spinner, SpinnerView } from 'ui/spinner';
import { Paragraph, ParagraphSize } from 'ui/paragraph';

import styles from './test-connect-result.pcss';

interface Props {
  open: boolean;
  onClose: () => void;
  isConnecting: boolean;
  connectionError?: Error;
}

export function TestConnectResult({ open, onClose, isConnecting, connectionError }: Props): ReactElement {
  const cn = useStyles(styles, 'test-connect-result');

  function renderMessage(icon: IconProp, message: ReactNode): ReactNode {
    return (
      <div className={cn('message')}>
        <FontAwesomeIcon size="2x" icon={icon} />
        <Paragraph size={ParagraphSize.S} className={cn('message-text')}>
          {message}
        </Paragraph>
      </div>
    );
  }

  function renderContent(): ReactNode {
    if (isConnecting) {
      return <Spinner view={SpinnerView.Block} />;
    }

    if (connectionError) {
      return renderMessage(faExclamationCircle, connectionError.message);
    }

    return renderMessage(faCheckCircle, 'No Errors');
  }

  return (
    <Modal title="Test Connection" open={open} onClose={onClose}>
      {renderContent()}
    </Modal>
  );
}
