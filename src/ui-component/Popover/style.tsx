import styled from 'styled-components';

export const PopoverContainer = styled.div`
  position: relative;
  padding-top: 5px;
`;

export const LaucherStyled = styled.div`
  cursor: pointer;
`;

export const PopoverMenuPanel = styled.div`
  position: absolute;
  z-index: 10;
  top: 30px;
  left: 10px;
  overflow: auto;
  border-radius: 8px;
  background: var(--color-white);
  box-shadow: 0px 2px 14px 0px rgba(193, 199, 216, 0.7);

  .cross-icon {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
  }
`;
