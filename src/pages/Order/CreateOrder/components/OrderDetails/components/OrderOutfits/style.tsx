import styled from 'styled-components';

export const OrderOutfitsContainer = styled.div`
  min-height: 80px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  padding: 20px;
  background-color: var(--color-white);
  border-bottom: 1px solid rgba(50, 52, 58, 0.1);
`;

export const AddNewOutfit = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const OutfitMenu = styled.div`
  position: relative;
  width: 250px;
  height: 280px;

  .outfit-list-item {
    cursor: pointer;
    padding: 4px 0px 4px 12px;

    &:hover {
      background-color: var(--color-primary);
      color: var(--color-white);
    }
  }
`;

export const SearchOutfitContainer = styled.div`
  height: 40px;
  border-bottom: 1px solid var(--color-nightRider);
  padding: 4px 8px;
  display: flex;
  align-items: center;
  margin: 12px;
`;

export const OutfitChip = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 40px;
  cursor: pointer;
  position: relative;
  border: ${({ isSelected = false }) =>
    isSelected ? '1px solid #3F3F70' : '1px solid rgba(189, 190, 194, 0.4)'};

  background-color: ${({ isSelected = false }) =>
    isSelected ? `rgba(77, 122, 255, 0.10)` : `var(--color-white)`};

  img {
    width: 24px;
    height: 24px;
  }

  .cross-icon {
    position: absolute;
    top: -15px;
    right: 0px;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--color-white);
    border: 1px solid var(--color-black);
    border-radius: 4px;
    cursor: pointer;
  }
`;
