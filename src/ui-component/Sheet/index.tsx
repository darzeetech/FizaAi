import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { CrossIcon } from '../../assets/icons';
import { Overlay } from '../';

import { SheetSize, SheetStyled } from './style';

type SheetProps = {
  children: ReactNode;
  size?: SheetSize;
  onClose?: () => void;
};

export type SheetMethods = {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  getSheetState: () => boolean;
};

const Sheet = forwardRef(
  ({ children, size = 'medium', onClose }: SheetProps, ref: ForwardedRef<SheetMethods>) => {
    const [isOpen, setIsOpen] = useState(false);

    const getSheetState = useCallback(() => isOpen, []);
    const show = useCallback(() => setIsOpen(true), []);
    const hide = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((isOpen) => !isOpen), []);

    useImperativeHandle(ref, () => ({
      show,
      hide,
      toggle,
      getSheetState,
    }));

    const element: any = document.getElementById('portal');

    if (!isOpen) {
      return null;
    }

    return (
      <>
        {createPortal(
          <>
            <Overlay show={true} />
            <SheetStyled size={size}>
              {children}
              <div
                className="cross-icon"
                onClick={() => {
                  if (typeof onClose === 'function') {
                    onClose();
                  } else {
                    hide();
                  }
                }}
              >
                <CrossIcon />
              </div>
            </SheetStyled>
          </>,
          element
        )}
      </>
    );
  }
);

Sheet.displayName = 'Sheet';

export default Sheet;
