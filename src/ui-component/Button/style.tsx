import styled, { css } from 'styled-components';

import type { Appearance, Size } from '.';

// const buttonTheme = theme();

type ButtonStyledProps = {
  size: Size;
  appearance: Appearance;
  color: string;
  bgColor: string;
  isCenter: boolean;
  disabled: boolean;
};

const getColor = (color: string) => {
  switch (color) {
    case 'primary':
      return `var(--color-primary)`;
    case 'secondary':
      return `var(--color-secondary)`;
    case 'tertiary':
      return `var(--color-tertiary)`;
    case 'disabled':
      return `var(--color-btn-disabled)`;
    case 'white':
      return `var(--color-white)`;
    case 'black':
      return `var(--color-black)`;
    default:
      return color;
  }
};

const getButtonStyle = (props: ButtonStyledProps) => {
  const { size, appearance, color, bgColor, disabled } = props;

  let style = `width=${size};`;

  const updatedBgColor = disabled ? 'disabled' : bgColor;

  switch (appearance) {
    case 'outlined':
      style += `
        border: 1px solid ${getColor(updatedBgColor)}; 
        background-color: ${getColor(color)}; 
        color:${getColor(updatedBgColor)};`;
      break;
    case 'filled':
    default:
      style += `
        border: 1px solid ${getColor(updatedBgColor)}; 
        background-color: ${getColor(updatedBgColor)}; 
        color:${getColor(color)};`;
  }

  return css`
    ${style}
  `;
};

const getButtonSize = (size: Size) => {
  switch (size) {
    case 'small':
      return css`
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 4px;
      `;
    case 'medium':
      return css`
        font-size: 14px;
        padding: 8px 16px;
        border-radius: 8px;
      `;
    case 'large':
      return css`
        font-size: 16px;
        padding: 12px 20px;
        border-radius: 12px;
      `;
    default:
      return css`
        font-size: 14px;
        padding: 8px 16px;
        border-radius: 8px;
      `;
  }
};

export const ButtonStyled = styled.button<ButtonStyledProps>`
  display: flex;
  justify-content: ${({ isCenter }) => (isCenter ? 'center' : 'space-between')};
  align-items: center;
  cursor: pointer;
  text-transform: capitalize;

  ${({ isCenter }) => !isCenter && 'gap: 4px;'}

  ${(props) => getButtonStyle(props)}
  ${({ size }) => getButtonSize(size)}
`;
