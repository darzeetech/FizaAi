import styled from 'styled-components';

export const OrderListStyled = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
  position: relative;
  height: 100vh;
  overflow-y: auto;
  width: 100%;

  .create-order-btn {
    position: absolute;
    right: 12px;
    top: 8px;
    z-index: 1;
  }
`;
