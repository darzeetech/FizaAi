import styled from 'styled-components';
import { Text } from '../../../../../ui-component';
import { getStatusBackgroundColor, getStatusColor } from '../../helperFuntion';

export const OutfitDetailsContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const OutfitSummaryHeader = styled.div`
  height: 60px;
  width: 100%;
  //position: fixed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background-color: var(--color-white);
  border-top-left-radius: 8px;
  border-bottom: 1px solid var(--color-darkGray);
  flex-wrap: wrap;

  .menu-container {
    position: relative;
    width: 250px;
    height: 280px;

    .menu-item {
      cursor: pointer;
      padding: 4px 0px 4px 12px;

      &:hover {
        background-color: var(--color-primary);
        color: var(--color-white);
      }
    }
  }

  .header-btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
  }
`;

export const OutfitSummaryContent = styled.div`
  height: calc(100% - 60px);
  overflow-y: auto;
  margin-top: 5px;
  margin-bottom: 50px;
  padding: 5px 10px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  .inspiration-text {
    margin-top: 10px;
    cursor: pointer;
  }
`;

export const OutfitChipContainer = styled.div`
  display: flex;
  justify-content: start;
  align-content: center;
  flex-wrap: wrap;
  gap: 10px;
`;

export const OutfitChipContent = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 40px;
  cursor: pointer;

  border: ${({ isSelected = false }) =>
    isSelected ? '1px solid #3F3F70' : '1px solid rgba(189, 190, 194, 0.4)'};

  background-color: ${({ isSelected = false }) =>
    isSelected ? `rgba(77, 122, 255, 0.10)` : `var(--color-white)`};

  img {
    width: 24px;
    height: 24px;
  }
`;

export const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 12px;

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .info-item-right {
    display: flex;
    justify-content: start;
    align-items: start;
    gap: 12px;
  }
`;

export const StatusContainer = styled.div<{ status: string }>`
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${({ status = '' }) => getStatusBackgroundColor(status)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const StatusText = styled(Text)<{ status: string }>`
  color: ${({ status = '' }) => getStatusColor(status)};
`;

export const StatusMenuContainer = styled.div`
  position: relative;
  width: 150px;
  margin: 8px 0px;
`;

export const StatusOptionItemText = styled(Text)<{ status: string }>`
  padding: 4px 12px;
  color: ${({ status = '' }) => getStatusColor(status)};

  &:hover {
    background-color: var(--color-primary);
    color: var(--color-white);
  }
`;
