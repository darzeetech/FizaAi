import styled from 'styled-components';

export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 24px;

  .page-num-container {
    cursor: pointer;
    min-width: 12px;
    text-align: center;
  }

  .next-page-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
  }
`;
