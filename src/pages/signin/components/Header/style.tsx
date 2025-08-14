import styled from 'styled-components';

export const HeaderContainer = styled.div`
  position: fixed;
  height: 60px;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 100px;
  background-color: var(--color-white);
  border-bottom: 1px solid rgba(50, 50, 50, 0.1);
`;

export const InfoContainer = styled.div`
  display: flex;
  gap: 40px;

  .item {
    cursor: pointer;
  }
`;
