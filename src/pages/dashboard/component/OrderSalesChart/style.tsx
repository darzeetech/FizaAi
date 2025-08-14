import styled, { css } from 'styled-components';
import { Box } from '../../style';

export const Container = styled(Box)<{ isEmpty: boolean }>`
  width: 390px;
  height: 336px;

  .content {
    position: relative;
    ${({ isEmpty = false }) =>
      isEmpty &&
      css`
        display: flex;
        justify-content: center;
        align-items: center;
      `}

    .inner-circle {
      position: absolute;
      top: 47px;
      right: 49px;
    }
    .outer-circle {
      position: absolute;
      top: 2px;
      right: 79px;
      width: 240px;
      height: 240px;
    }
  }

  .VictoryContainer {
    width: 350px !important;
    height: 220px !important;
  }
`;

export const ChartInfo = styled.div`
  display: flex;
  width: inherit;
  justify-content: space-between;
  margin-bottom: 8px;

  .label {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

export const ChartColorBox = styled.div<{ bgColor: string }>`
  width: 16px;
  height: 16px;
  border-radius: 2px;
  background-color: ${({ bgColor }) => bgColor};
`;
