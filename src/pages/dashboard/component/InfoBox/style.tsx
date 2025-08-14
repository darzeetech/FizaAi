import styled from 'styled-components';

export const Box = styled.div`
  min-width: 190px;
  display: flex;
  padding: 16px;
  gap: 16px;
  border-radius: 8px;
  border: 1px solid rgba(168, 168, 168, 0.15);
  background-color: var(--colro-white);

  .amount-container {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;
