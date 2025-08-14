import styled from 'styled-components';

export const SelectedCustomerContainer = styled.div`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-white);
  padding: 20px;
  z-index: 100;
`;

export const CustomerDetails = styled.div`
  display: flex;
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
