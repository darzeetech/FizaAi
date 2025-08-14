import styled from 'styled-components';

export const OutfitDetailsContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;

  .date-field-container {
    width: 50%;
    min-width: 250px;
    max-width: 330px;
  }
`;
