import styled from 'styled-components';

export const OrderDetailsContainer = styled.div`
  /* flex: 1; */
  height: inherit;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: var(--color-lavender);
  padding-bottom: 50px;
`;

export const OrderDetailsContent = styled.div`
  flex: 1;
  width: inherit;
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
`;

export const OutfitDetailsContainer = styled.div`
  display: flex;
  flex: 1;
  max-height: calc(-212px + 100vh);
`;

export const CloseModalBody = styled.div`
  padding-top: 24px;
`;
