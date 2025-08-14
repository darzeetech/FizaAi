import styled, { css } from 'styled-components';
import { Box } from '../../style';

export const Container = styled(Box)<{ isEmpty: boolean }>`
  width: 376px;
  height: 336px;

  .header-content {
    display: flex;
    justify-content: space-between;
  }

  .content {
    ${({ isEmpty = false }) =>
      isEmpty &&
      css`
        display: flex;
        justify-content: center;
        align-items: center;
      `}
  }
`;
