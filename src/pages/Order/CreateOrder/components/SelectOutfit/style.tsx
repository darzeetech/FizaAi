import styled from 'styled-components';

export const SelectOutfitContainer = styled.div`
  height: inherit;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: var(--color-lavender);
`;

export const SelectedCustomerContainer = styled.div`
  height: 60px;
  display: flex;
  justify-content: right;
  align-items: center;
  background-color: var(--color-white);
  padding: 20px;
`;

export const CustomerDetails = styled.div`
  display: none;
  align-items: center;
  gap: 8px;

  .profile-pic {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: rgba(77, 122, 255, 0.2);
  }
`;

export const ActionContainer = styled.div`
  display: flex;
  gap: 12px;
`;

export const OutfitListContainer = styled.div`
  flex: 1;
  width: inherit;
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
  padding: 20px;
  overflow-y: auto;
`;

export const OutfitCardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  margin-top: 20px;
`;
