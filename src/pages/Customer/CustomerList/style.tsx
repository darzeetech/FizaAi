import styled from 'styled-components';

export const Container = styled.div`
  height: inherit;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: var(--color-lavender);
`;

export const Header = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-white);
  padding: 20px;
`;

export const ContentContainer = styled.div`
  flex: 1;
  width: inherit;
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
  padding: 20px;
  overflow-y: auto;
`;

export const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 24px;
`;
