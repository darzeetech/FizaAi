import styled from 'styled-components';
import { Text } from '../../../../../ui-component';
import { getStatusColor } from '../../helperFuntion';

export const Container = styled.div<{ isBottomPadding: boolean }>`
  ${({ isBottomPadding = false }) => isBottomPadding && 'padding-bottom :12px'}
`;

export const FilterContainer = styled.div`
  /* min-height: 70px; */
  width: 100%;
  padding: 12px 12px 0px 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .status-filter {
    width: 250px;
  }

  .status-chip-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  .status-chip {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    background-color: rgba(37, 30, 30, 0.04);
    border: 1px solid var(--color-mortar);
    border-radius: 6px;
    padding: 2px 4px;
  }
`;

export const TableContainer = styled.div`
  width: 100%;
  padding-top: 12px;
  border-collapse: collapse;
  border-spacing: 0px;

  thead {
    display: table;
    width: 100%;
    height: 50px;
    table-layout: fixed;
    background-color: var(--color-slateGrey);

    th {
      padding: 4px 12px 0 12px;
      text-transform: capitalize;
      height: 16px;
    }
  }

  tbody {
    width: 100%;
    //height: calc(
      100vh - 196px - 70px
    ); //Calculating height of tbody by subtracting all the above and below containers
    display: block;
    //overflow: auto;
    background-color: var(--color-white);
     margin-bottom: 1rem;
     padding-bottom: 2rem;

    .empty-list {
      text-align: center;
      margin-top: 20px;
    }
  }
`;

export const StyledTh = styled.td<{ width?: number }>`
  width: ${({ width = 10 }) => width}%;
  padding: 4px 8px;
  overflow-wrap: break-word;

  .header-td-container {
    display: flex;
    gap: 16px;
  }
`;

const getRowBgColor = (isEven = false) => {
  if (isEven) {
    return 'var(--color-gainsboro)';
  }

  return 'var(--color-white)';
};

export const StyledTr = styled.tr<{ isChildTable?: boolean; isEven?: boolean }>`
  display: table;
  width: 100%;
  table-layout: fixed;
  min-block-size: 50px;

  background-color: ${({ isEven = false }) => getRowBgColor(isEven)};
`;

export const StyledCell = styled.td<{ width?: number }>`
  width: ${({ width = 10 }) => width}%;
  overflow-wrap: break-word;
  padding: 4px 8px;
`;

export const ArrowIconContainer = styled.div`
  cursor: pointer;
`;

export const PaginationContainer = styled.div`
  position: fixed;
  bottom: 0px;
  width: calc(100vw - 250px);
  height: 36px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-white);
  border-top: 1px solid rgba(50, 50, 50, 0.15);
`;

export const StatusContainer = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  gap: 12px;

  .circle {
    min-width: 8px;
    min-height: 8px;
    border-radius: 50%;
    background-color: ${({ status = '' }) => getStatusColor(status)};
  }
`;

export const StatusText = styled(Text)<{ status: string }>`
  color: ${({ status = '' }) => getStatusColor(status)};
`;
