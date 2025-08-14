import {
  ForwardedRef,
  ReactElement,
  ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';

import { CrossIcon } from '../../assets/icons';
import Button from '../Button';
import { PopoverContainer, LaucherStyled, PopoverMenuPanel } from './style';

type PopoverProps = {
  laucher?: ReactElement;
  children: ReactNode;
};

export type PopoverMethods = {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  getPopoverState: () => boolean;
};

const Popover = forwardRef(
  ({ laucher, children }: PopoverProps, ref: ForwardedRef<PopoverMethods>) => {
    const [isOpen, setIsOpen] = useState(false);

    const getPopoverState = useCallback(() => isOpen, []);
    const show = useCallback(() => setIsOpen(true), []);
    const hide = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((isOpen) => !isOpen), []);

    useImperativeHandle(ref, () => ({
      show,
      hide,
      toggle,
      getPopoverState,
    }));

    const laucherBtn = <Button>Open</Button>;

    return (
      <PopoverContainer>
        <LaucherStyled
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((open) => !open);
          }}
        >
          {laucher ?? laucherBtn}
        </LaucherStyled>

        {isOpen && (
          <PopoverMenuPanel>
            {children}
            <div className="cross-icon" onClick={() => setIsOpen(false)}>
              <CrossIcon />
            </div>
          </PopoverMenuPanel>
        )}
      </PopoverContainer>
    );
  }
);

Popover.displayName = 'Popover';

export default Popover;
