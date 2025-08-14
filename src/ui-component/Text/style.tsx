import { CSSProperties } from 'react';
import styled, { css } from 'styled-components';

export type TextSize = 'small' | 'medium' | 'large' | 'xl' | 'xxl' | 'xxxl';
export type FontWeight = 400 | 500 | 600 | 700 | 800 | 900;

type TextStyledProps = {
  size: TextSize;
  color: string;
  fontWeight: FontWeight;
  textDecoration: CSSProperties['textDecoration'];
};

// const namedTyography = theme('name', {

// })

const getTextColor = (color: string) => {
  switch (color) {
    case 'primary':
      return css`
        color: var(--color-primary);
      `;
    case 'secondary':
      return css`
        color: var(--color-secondary);
      `;
    case 'tertiary':
      return css`
        color: var(--color-tertiary);
      `;
    case 'disabed':
      return css`
        color: var(--color-disabed);
      `;
    case 'white':
      return css`
        color: var(--color-white);
      `;
    case 'black':
      return css`
        color: var(--color-black);
      `;

    default:
      return css`
        color: ${color};
      `;
  }
};

const getTextSize = (size: TextSize) => {
  switch (size) {
    case 'small':
      return css`
        font-size: 12px;
      `;
    case 'medium':
      return css`
        font-size: 14px;
      `;
    case 'large':
      return css`
        font-size: 18px;
      `;
    case 'xl':
      return css`
        font-size: 20px;
      `;
    case 'xxl':
      return css`
        font-size: 24px;
      `;
    case 'xxxl':
      return css`
        font-size: 28px;
      `;
    default:
      return css`
        font-size: 14px;
      `;
  }
};

export const TextStyled = styled.div<TextStyledProps>`
  font-weight: ${({ fontWeight }) => fontWeight};
  text-decoration: ${({ textDecoration }) => textDecoration};

  ${({ color }) => getTextColor(color)}
  ${({ size }) => getTextSize(size)}
`;
