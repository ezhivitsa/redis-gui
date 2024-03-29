import { faTimes } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import { ReactElement, ReactNode } from 'react';
import ReactModal from 'react-modal';

import { useStyles } from 'renderer/lib/theme';

import { ButtonIcon } from 'renderer/ui/button-icon';
import { Heading, HeadingSize, HeadingView } from 'renderer/ui/heading';

import styles from './modal.pcss';

ReactModal.setAppElement('#root');

export enum ModalView {
  Default = 'default',
  Condensed = 'condensed',
}

interface Props {
  children?: ReactNode;
  className?: string;
  open?: boolean;
  onClose?: () => void;
  title: string;
  view: ModalView;
}

export function Modal(props: Props): ReactElement {
  const { children, open, title, onClose, view, className } = props;
  const cn = useStyles(styles, 'modal');

  return (
    <ReactModal
      isOpen={open || false}
      className={classnames(cn(), className)}
      overlayClassName={cn('overlay')}
      closeTimeoutMS={200}
      onRequestClose={onClose}
      portalClassName={cn('portal')}
    >
      <div className={cn('header')}>
        <Heading size={HeadingSize.M} view={HeadingView.Condensed}>
          {title}
        </Heading>

        <ButtonIcon icon={faTimes} onClick={onClose} />
      </div>
      <div className={cn('content', { view })}>{children}</div>
    </ReactModal>
  );
}

Modal.defaultProps = {
  view: ModalView.Default,
};
