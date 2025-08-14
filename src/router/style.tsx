import styled from 'styled-components';

export const PrivateContainer = styled.div<{ sidebarRequired: boolean }>`
  width: 100vw;
  height: 100vh;
  display: flex;

  flex-direction: ${({ sidebarRequired = true }) => (sidebarRequired ? 'row' : 'column')};
`;

export const RightContainer = styled.div`
  flex: 1;
`;

export const ContentContainer = styled.div<{ hasHeader?: boolean }>`
  height: calc(100vh - 60px);
`;

export const PublicWrapperContent = styled.div`
  display: flex;
  //padding-top: 60px;
  width: inherit;
  height: inherit;
`;
