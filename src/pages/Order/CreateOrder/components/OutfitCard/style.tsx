import styled, { css } from 'styled-components';

export const OutfitCardContainer = styled.div<{ isSelected: boolean }>`
  width: 180px;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 8px;
  background: var(--color-white);
  box-shadow: 0px 2px 14px 0px rgba(193, 199, 216, 0.6);
  cursor: pointer;

  ${({ isSelected = false }) =>
    isSelected &&
    css`
      border: 1px solid var(--color-primary);
    `}

  .outfit-selection-checkbox {
    position: absolute;
    left: 8px;
    top: 8px;
  }

  img {
    width: 60px;
    height: 60px;
  }
`;
