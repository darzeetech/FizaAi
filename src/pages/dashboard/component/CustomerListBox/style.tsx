import styled, { css } from 'styled-components';
import { Box } from '../../style';

export const Container = styled(Box)<{ isEmptyList?: boolean }>`
  width: 380px;
  height: 336px;

  .header-content {
    display: flex;
    justify-content: flex-start;
    gap: 8px;
  }

  .content {
    ${({ isEmptyList = false }) =>
      isEmptyList &&
      css`
        display: flex;
        justify-content: center;
        align-items: center;
      `}
  }
`;

export const CustomerBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  .customer-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .sales-content {
      text-align: end;

      .amount-container {
        display: flex;
        justify-content: end;
        gap: 4px;
      }
    }
  }
`;
