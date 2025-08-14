import styled from 'styled-components';

export const CounterStyled = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border-radius: 8px;
  background: var(--color-white);
  box-shadow: 0px 2px 14px 0px #c1c7d8;
`;

export const LabelContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

export const IconContainer = styled.div<{ isEnable: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ isEnable = true }) => isEnable && 'cursor: pointer;'}
`;
