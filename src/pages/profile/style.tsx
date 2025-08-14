import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  height: calc(100vh - 84px);
  overflow: auto;
  padding: 24px 0px;
  margin-top: 38px;
`;
export const EmptyContainer = styled.div`
  flex: 0.3;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DetailsContainer = styled.div`
  flex: 0.4;
  display: flex;
`;

export const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 350px;
`;

export const NextStepContainer = styled.div<{ disabled: boolean }>`
  /* flex: 0.3; */
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100px;
  height: 100px;
  background-color: var(--color-primary);
  border-radius: 100%;
  cursor: pointer;

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: none;
      background-color: var(--color-disabled);
    `}
`;

// export const NextStepContainer = styled.div`;
//   position: fixed;
//   width: 10rem;
//   height: 10rem;
//   background-color: var(--color-primary);
//   border-radius: 100%;
//   top: 50%;
//   left: 75%;
//   transform: translate(-50%, -75%);
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;
