import { ReactNode } from 'react';
import { IconContainer } from './style';

type IconWrapperProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

const IconWrapper = ({ children, onClick, className }: IconWrapperProps) => {
  return (
    <IconContainer className={className} onClick={onClick}>
      {children}
    </IconContainer>
  );
};

export default IconWrapper;
