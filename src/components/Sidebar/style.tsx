import styled from 'styled-components';

type ListItemProps = {
  isActive?: boolean;
};

export const Container = styled.div`
  width: 230px;
  background-color: var(--color-black);
  display: flex;
  flex-direction: column;
  /* position: fixed; */
  height: 100vh;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 0.2;
  padding: 16px 60px 16px 30px;

  .img-container {
    cursor: pointer;
  }
`;

export const ListContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ListItem = styled.div<ListItemProps>`
  display: flex;
  gap: 12px;
  padding: 5px 40px;
  cursor: pointer;

  ${({ isActive = false }) => (isActive ? 'background-color: rgba(255, 255, 255, 0.21);' : '')}
`;

export const IconContainer = styled.div`
  width: 24px;
  height: 24px;
`;

export const LogoutContainer = styled.div`
  display: flex;
  flex: 0.2;
  gap: 12px;
  padding: 5px 40px;
  cursor: pointer;
`;
