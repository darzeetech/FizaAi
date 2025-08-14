import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import _isNil from 'lodash/isNil';

import { Button, Overlay, Text } from '../../ui-component';
import { CrossIcon } from '../../assets/icons';

import { ModalContainer, ModalHeader, ModalBody, ModalFooter, ModalSize } from './style';

type ModalProps = {
  children: ReactNode;
  title?: string;
  size?: ModalSize;
  headerComponent?: ReactNode;
  footerComponent?: ReactNode;
  closeButtonText?: string;
  saveButtonText?: string;
  isSaveEnabled?: boolean;
  showCloseIcon?: boolean;
  showFooter?: boolean;
  onModalClose?: () => void;
  onModalSuccess?: () => void;
};

export type ModalMethods = {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  getModalState: () => boolean;
};

const Modal = forwardRef(
  (
    {
      children,
      title,
      size = 'large',
      headerComponent,
      footerComponent,
      closeButtonText = 'Close',
      saveButtonText = 'Save',
      isSaveEnabled = true,
      showCloseIcon = true,
      showFooter = true,
      onModalClose,
      onModalSuccess,
    }: ModalProps,
    ref: ForwardedRef<ModalMethods>
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    const getModalState = useCallback(() => isOpen, []);
    const show = useCallback(() => setIsOpen(true), []);
    const hide = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((isOpen) => !isOpen), []);

    useImperativeHandle(ref, () => ({
      show,
      hide,
      toggle,
      getModalState,
    }));

    const element: any = document.getElementById('portal');

    const hasHeader = !_isNil(headerComponent) || !_isNil(title);

    if (!isOpen) {
      return null;
    }

    return (
      <>
        {createPortal(
          <div>
            <Overlay show={true} />
            <ModalContainer size={size}>
              {showCloseIcon && (
                <div className="cross-icon mt-[10px] mx-[10px]" onClick={hide}>
                  <CrossIcon />
                </div>
              )}
              {hasHeader && (
                <ModalHeader>
                  {headerComponent ?? (
                    <Text size="large" fontWeight={700}>
                      {title ?? ''}
                    </Text>
                  )}
                </ModalHeader>
              )}
              <ModalBody>{children}</ModalBody>
              {showFooter && (
                <ModalFooter>
                  {footerComponent ?? (
                    <>
                      <Button appearance="outlined" bgColor="black" onClick={onModalClose}>
                        {closeButtonText}
                      </Button>
                      <Button
                        disabled={!isSaveEnabled}
                        onClick={() => {
                          if (isSaveEnabled && typeof onModalSuccess === 'function') {
                            onModalSuccess();
                          }
                        }}
                      >
                        {saveButtonText}
                      </Button>
                    </>
                  )}
                </ModalFooter>
              )}
            </ModalContainer>
          </div>,
          element
        )}
      </>
    );
  }
);

Modal.displayName = 'Modal';

export default Modal;
