import { MouseEvent, ReactNode } from 'react';
import _isNil from 'lodash/isNil';

import { ButtonStyled } from './style';

export type Size = 'small' | 'medium' | 'large';
export type Appearance = 'filled' | 'outlined';

export type ButtonProps = {
  label?: string;
  children?: ReactNode;
  size?: Size;
  appearance?: Appearance;
  color?: string;
  bgColor?: string;
  disabled?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  as?: any;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

const Button = (props: ButtonProps) => {
  const {
    label,
    children,
    size = 'medium',
    appearance = 'filled',
    color = 'white',
    bgColor = 'primary',
    disabled = false,
    as,
    leadingIcon,
    trailingIcon,
    className,
    onClick,
  } = props;

  const text = label ?? children;

  return (
    <ButtonStyled
      type="button"
      disabled={disabled}
      onClick={onClick}
      size={size}
      color={color}
      appearance={appearance}
      bgColor={bgColor}
      as={as}
      isCenter={_isNil(leadingIcon) && _isNil(trailingIcon)}
      className={className}
    >
      {leadingIcon}
      {text}
      {trailingIcon}
    </ButtonStyled>
  );
};

export default Button;
