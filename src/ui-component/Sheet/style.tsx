import styled, { css } from 'styled-components';

export type SheetSize = 'small' | 'medium' | 'large';

type SheetStyledProps = {
  size: SheetSize;
};

export const getSheetSize = (size: SheetSize) => {
  switch (size) {
    case 'small':
      return css`
        width: 25%;
      `;
    case 'large':
      return css`
        width: 75%;
      `;
    default:
      //default sheet size is medium
      return css`
        width: 50%;
      `;
  }
};

export const SheetStyled = styled.div<SheetStyledProps>`
  position: fixed;
  height: calc(100% - 60px);
  display: flex;
  top: 60px;
  right: 0;
  z-index: 500;
  background-color: var(--color-white);
  border-radius: 8px 0px 0px 8px;
  transition: all 0.3s ease-in-out;

  ${({ size }) => getSheetSize(size)}

  .cross-icon {
    position: absolute;
    left: -40px;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--color-white);
    border-radius: 4px;
    cursor: pointer;
  }
`;
